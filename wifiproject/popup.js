
objButton1 = document.getElementById("button1");
objButton2 = document.getElementById("button2");
objButton3 = document.getElementById("button3");

colorButton1 = "#0599D9";
colorButton2 = "#0068B7";
colorButton3 = "#ED6D00";

//--display header box

setTimeout(
  function(){
    move("#headerbox1")
      .set("top","5px")
      .duration(300)
      .then()
        .set("top","2px")
        .duration(100)
        .pop()
      .end();
  },
  50
);
setTimeout(
  function(){
    move("#headerbox2")
      .set("top","5px")
      .duration(300)
      .then()
        .set("top","2px")
        .duration(100)
        .pop()
      .end();
    },
  100
);
setTimeout(
  function(){
    move("#headerbox3")
      .set("top","5px")
      .duration(300)
      .then()
        .set("top","2px")
        .duration(100)
        .pop()
      .end();
    },
  150
);
setTimeout(
  function(){
    move("#headerbox4")
      .set("top","5px")
      .duration(300)
      .then()
        .set("top","2px")
        .duration(100)
        .pop()
      .end();
    },
  200
);
setTimeout(
  function(){
    move("#headerbox5")
      .set("top","5px")
      .duration(300)
      .then()
        .set("top","2px")
        .duration(100)
        .pop()
      .end();
    },
  250
);

objButton1.onclick=function(){
  initButton();
  pushButton(objButton1.id,function(){
      changeBodyClore(colorButton1);
      setButtonColor(objButton1.id,colorButton1);

      hideButton(objButton1.id);
    }
  );
};
objButton2.onclick=function(){
  initButton();
  pushButton(objButton2.id,function(){
      changeBodyClore(colorButton2);
      setButtonColor(objButton2.id,colorButton2);

      hideButton(objButton2.id);
    }
  );
};

objButton3.onclick=function(){
  initButton();
  pushButton(objButton3.id,function(){
      changeBodyClore(colorButton3);
      setButtonColor(objButton3.id,objButton3);

      hideButton(objButton3.id);
    }
  );
}

function hideButton(id){
  move("#" + id)
    .set('height','0')
    .set('opacity', 0)
    .end();
}

function pushButton(id,fn){
  move("#" + id)
    .scale(0.95)
    .duration(100)
    .end(
     function(){
       move("#" + id)
          .scale(1)
          .end(fn);
     }
   );
}

function setButtonColor(currentButtonId,color){
    initButton();
    //set button color
    move('#'+ currentButtonId )
      .set('background-color', color)
      //.then()
        //.set('opacity', 0)
          //.then()
          //.set('display', 'none')
        //.pop()
      .end();
}

function initButton(){
  // button color initialize
  objButton1.style.backgroundColor = colorButton1;
  objButton2.style.backgroundColor = colorButton2;
  objButton3.style.backgroundColor = colorButton3;

  //display button
  objButton1.style.display = 'block';
  objButton2.style.display = 'block';
  objButton3.style.display = 'block';

  move("#" + objButton1.id).set('height','10%').set('opacity', 1).end();
  move("#" + objButton2.id).set('height','10%').set('opacity', 1).end();
  move("#" + objButton3.id).set('height','10%').set('opacity', 1).end();
}

function changeBodyClore(color){
  move('body')
    .set('background-color', color)
    .duration(1000)
    .end();
}
