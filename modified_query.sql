{% assign target_month = Data.Workflow.TargetMonth | date: "%Y-%m" %}

--===============================
-- DataQuery - Get Detail
--===============================

WITH IntroducingAgentData AS (
    -------------------------------------------------------------------
    -- os 相当: 現行の Subscription / Order 情報を取得
    -------------------------------------------------------------------
    SELECT 
        s.id                                     AS subscription_id,
        s.accountid,
        s.subscriptionstartdate,
        o.IntroducingAgent_Margin_FirstYear__c   AS margin_first_year,
        o.IntroducingAgent_Margin_SecondYear__c  AS margin_second_year,
        o.IntroducingAgent_Margin_ThirdYear__c   AS margin_third_year,
        o.IntroducingAgent_Margin_fixed_FirstYear__c AS margin_fixed_first_year,
        o.introducingagent_billingaccountid__c   AS billing_account_id
  
    FROM subscription s
    JOIN orderaction oa
        ON oa.subscriptionid = s.id
    JOIN orders o
        ON o.id = oa.orderid
    WHERE 
        o.IntroducingAgent_Margin_FirstYear__c   IS NOT NULL
        AND o.IntroducingAgent_Margin_SecondYear__c IS NOT NULL
        AND o.IntroducingAgent_Margin_ThirdYear__c  IS NOT NULL
        AND o.introducingagent_billingaccountid__c  IS NOT NULL
    GROUP BY 
        s.id,
        s.accountid,
        s.subscriptionstartdate,
        o.IntroducingAgent_Margin_FirstYear__c,
        o.IntroducingAgent_Margin_SecondYear__c,
        o.IntroducingAgent_Margin_ThirdYear__c,
        o.IntroducingAgent_Margin_fixed_FirstYear__c,
        o.introducingagent_billingaccountid__c
),

IntroducingAgentDataFirstVersion AS (
    -------------------------------------------------------------------
    -- os_first_version 相当: version=1 (初回注文) の Subscription / Order 情報
    -------------------------------------------------------------------
    SELECT
        s.name                           AS subscription_name,
        s.accountid                      AS accountid_first_version,
        s.subscriptionstartdate          AS subscriptionstartdate_first_version,
        o.IntroducingAgent_Margin_FirstYear__c   AS margin_first_year,
        o.IntroducingAgent_Margin_SecondYear__c  AS margin_second_year,
        o.IntroducingAgent_Margin_ThirdYear__c   AS margin_third_year,
        o.IntroducingAgent_Margin_fixed_FirstYear__c AS margin_fixed_first_year,
        o.introducingagent_billingaccountid__c   AS billing_account_id
    FROM subscription s
    JOIN orderaction oa
        ON oa.subscriptionid = s.id
    JOIN orders o
        ON o.id = oa.orderid
    WHERE
        o.IntroducingAgent_Margin_FirstYear__c   IS NOT NULL
        AND o.IntroducingAgent_Margin_SecondYear__c IS NOT NULL
        AND o.IntroducingAgent_Margin_ThirdYear__c  IS NOT NULL
        AND o.introducingagent_billingaccountid__c  IS NOT NULL
        AND s.version = 1
    GROUP BY
        s.name,
        s.accountid,
        s.subscriptionstartdate,
        o.IntroducingAgent_Margin_FirstYear__c,
        o.IntroducingAgent_Margin_SecondYear__c,
        o.IntroducingAgent_Margin_ThirdYear__c,
        o.IntroducingAgent_Margin_fixed_FirstYear__c,
        o.introducingagent_billingaccountid__c
),

-------------------------------------------------------------------
-- MarginDataBase: インボイス × サブスクリプション情報を結合
-------------------------------------------------------------------
MarginDataBase AS (
    SELECT 
        ---------------------------------
        -- 紹介代理店情報
        ---------------------------------
        a.AccountNumber AS introducingAgentAccountNumber,
        a.Name          AS introducingAgentName,

        ---------------------------------
        -- エンドユーザー情報
        ---------------------------------
        so.name         AS endUserName,
        c.LastName      AS lastName,
        c.FirstName     AS firstName,

        ---------------------------------
        -- 請求/料金情報
        ---------------------------------
        i.InvoiceDate                           AS invoiceDate,
        i.InvoiceNumber                          AS invoiceNumber,
        ii.discountamount,
        FLOOR(ii.chargeamount + ii.discountamount) AS chargeAmount,
        rp.name                                 AS ratePlanName,

        ---------------------------------
        -- マージン率 (1〜3年目)
        ---------------------------------
        COALESCE(os.margin_first_year, os_first_version.margin_first_year)   
            AS introducingAgentMarginFirstYear,
        COALESCE(os.margin_second_year, os_first_version.margin_second_year) 
            AS introducingAgentMarginSecondYear,
        COALESCE(os.margin_third_year, os_first_version.margin_third_year)   
            AS introducingAgentMarginThirdYear,
        COALESCE(os.margin_fixed_first_year, os_first_version.margin_fixed_first_year)   
            AS introducingAgentMarginFixedFirstYear,

        ---------------------------------
        -- サブスク開始日 & 経過年数
        ---------------------------------
        COALESCE(
            os.subscriptionstartdate, 
            os_first_version.subscriptionstartdate_first_version
        ) AS subscriptionStartDate,

        DATE_DIFF(
            'year', 
            COALESCE(os.subscriptionstartdate, os_first_version.subscriptionstartdate_first_version),
            DATE_PARSE('{{target_month}}', '%Y-%m')  -- ← 指定の月 'yyyy-mm' を基準に年差分を計算
        ) + 1 AS subscriptionYear,
----{{ Data.Workflow.TargetMonth | date: "%Y-%m"}}
        ---------------------------------
        -- サービス利用期間表示
        ---------------------------------
        CAST(ii.ServiceStartDate AS VARCHAR) 
            || ' - ' 
            || CAST(ii.ServiceEndDate AS VARCHAR) AS servicePeriod,
        rpc.ChargeNumber ChargeNumber
        
    FROM invoice i
    JOIN invoiceitem ii
        ON i.id = ii.invoiceid
    JOIN rateplan rp
        ON rp.id = ii.rateplanid
    JOIN rateplancharge rpc 
        ON rpc.id = ii.rateplanchargeid
    
    -- サブスクリプション本体 & マージン情報
    JOIN subscription s
        ON s.id = ii.subscriptionid
    LEFT JOIN IntroducingAgentData os
        ON os.subscription_id = s.id
    LEFT JOIN IntroducingAgentDataFirstVersion os_first_version
        ON os_first_version.subscription_name = s.name
    
    ---------------------------------
    -- 紹介代理店(IntroducingAgent) アカウントを結合
    ---------------------------------
    JOIN account a
        ON a.id = COALESCE(os.billing_account_id, os_first_version.billing_account_id)
    
    ---------------------------------
    -- 請求先コンタクト & エンドユーザー
    ---------------------------------
    JOIN contact c
        ON a.BillToId = c.id
    JOIN account so
        ON so.id = s.accountid  

    WHERE
        i.status = 'Posted'
        AND ii.AppliedToInvoiceItemId IS NULL
),

-------------------------------------------------------------------
-- MarginData: マージン金額 & マージン率を計算
-------------------------------------------------------------------
MarginData AS (
    SELECT 
        introducingAgentAccountNumber,
        introducingAgentName,
        endUserName,
        lastName,
        firstName,
        invoiceDate,
        invoiceNumber,
        chargeAmount,
        ratePlanName,
        
        introducingAgentMarginFirstYear,
        introducingAgentMarginSecondYear,
        introducingAgentMarginThirdYear,
        introducingAgentMarginFixedFirstYear,
        
        subscriptionStartDate,
        subscriptionYear,
        
        ---------------------------------
        -- マージン金額を計算
        ---------------------------------
        CAST(
          FLOOR(
            CASE 
              WHEN subscriptionYear = 1 THEN 
                   (chargeAmount + discountamount) 
                     * (CAST(introducingAgentMarginFirstYear  AS DOUBLE) / 100)
              WHEN subscriptionYear = 2 THEN 
                   (chargeAmount + discountamount) 
                     * (CAST(introducingAgentMarginSecondYear AS DOUBLE) / 100)
              WHEN subscriptionYear = 3 THEN 
                   (chargeAmount + discountamount) 
                     * (CAST(introducingAgentMarginThirdYear  AS DOUBLE) / 100)
              ELSE 
                  NULL
            END
          ) 
          AS BIGINT
        ) AS marginAmount,

        ---------------------------------
        -- 何年目かによってマージン率を切り替え
        ---------------------------------
        CASE
          WHEN subscriptionYear = 1 THEN introducingAgentMarginFirstYear
          WHEN subscriptionYear = 2 THEN introducingAgentMarginSecondYear
          WHEN subscriptionYear = 3 THEN introducingAgentMarginThirdYear
          ELSE NULL
        END AS marginPercentage,

        servicePeriod,
        ChargeNumber
    FROM MarginDataBase
    WHERE 
    date_format(invoiceDate, '%Y-%m') = '{{target_month}}'    
)

-------------------------------------------------------------------
-- 最終集計
-------------------------------------------------------------------
SELECT
    introducingAgentAccountNumber,
    introducingAgentName,
    SUM(marginAmount) AS totalMarginAmount,
    lastName,
    firstName
FROM MarginData
GROUP BY 
    introducingAgentAccountNumber,
    introducingAgentName,
    lastName,
    firstName