
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
  0
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
  50
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
  100
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


objButton1.onclick=function(){
  initButton();
  changeBodyClore(colorButton1);
  setButtonColor(objButton1.id,'#FFFFFF');

};

objButton2.onclick=function(){
  initButton();
  move('.head .box')
    .set('margin-left', 0)
    .end();
    changeBodyClore(colorButton2);
    setButtonColor(objButton2.id,'#FFFFFF');
    move("#" + objButton3.id)
       .scale(0.95)
       .duration(100)
       .then()
        .scale(2)
        .duration(1000)
       .pop()
     .end(
       function(){
          setTimeout(
            function(){
              move("#body1")
              .set('background-color', colorButton3)
              .duration(1000)
              .end();
            }
          ,1)
          }
         );
};
objButton3.onclick=function(){
  //initButton();

   move("#" + objButton3.id)
      .scale(0.95)
      .duration(100)
    .end(
      function(){
      move("#" + objButton3.id)
      .scale(2)
      .duration(1000)
      .end(function(){
            move("#button1")
            .set('background-color', 'red')
            .duration(3000)
            .end();
          }
        );
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
}

function changeBodyClore(color){
  move('body')
    .set('background-color', color)
    .duration(1000)
    .end();
}
