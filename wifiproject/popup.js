var isMobile = true;

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

if(isMobile){
  objButton1.ontouchstart=function(){
    move("#" + objButton1.id).scale(0.95).duration(100).end();
  };
  objButton2.ontouchstart=function(){
    move("#" + objButton2.id).scale(0.95).duration(100).end();
  };
  objButton3.ontouchstart=function(){
    move("#" + objButton3.id).scale(0.95).duration(100).end();
  };
}else{
  objButton1.onmousedown=function(){
    move("#" + objButton1.id).scale(0.95).duration(100).end();
  };
  objButton2.onmousedown=function(){
    move("#" + objButton2.id).scale(0.95).duration(100).end();
  };
  objButton3.onmousedown=function(){
    move("#" + objButton3.id).scale(0.95).duration(100).end();
  };
}
if(isMobile){
  document.ontouchend=function(){
      move("#" + objButton1.id).scale(1).duration(100).end();
      move("#" + objButton2.id).scale(1).duration(100).end();
      move("#" + objButton3.id).scale(1).duration(100).end();
  };
}else{
  document.onmouseup=function(){
      move("#" + objButton1.id).scale(1).duration(100).end();
      move("#" + objButton2.id).scale(1).duration(100).end();
      move("#" + objButton3.id).scale(1).duration(100).end();
  };
}


objButton1.onclick=function(){
  //pushButton(objButton1.id,function(){
      changeBodyClore(colorButton1);
      setButtonColor(objButton1.id,objButton1);
      hideButton(objButton1.id);
      showButtons(objButton1.id);
  //  }
  //);

};

objButton2.onclick=function(){
  //pushButton(objButton2.id,function(){
      changeBodyClore(colorButton2);
      setButtonColor(objButton2.id,colorButton2);
      hideButton(objButton2.id);
      showButtons(objButton2.id);
  //  }
  //);
};

objButton3.onclick=function(){
  //pushButton(objButton3.id,function(){
      changeBodyClore(colorButton3);
      setButtonColor(objButton3.id,objButton3);
      hideButton(objButton3.id);
      showButtons(objButton3.id);
    //}
  //);
}

function hideButton(id,fn){
  move("#" + id)
    .set('height','0')
    .set('opacity', 0)
    .end(fn);
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
    //set button color
    move('#'+ currentButtonId )
      .set('background-color', color)
      .end();
}

function showButtons(id){
  if(id!=objButton1.id)
    move("#" + objButton1.id).set('height','10%').set('opacity', 1).end();
  if(id!=objButton2.id)
    move("#" + objButton2.id).set('height','10%').set('opacity', 1).end();
  if(id!=objButton3.id)
    move("#" + objButton3.id).set('height','10%').set('opacity', 1).end();
}

function changeBodyClore(color){
  move('body')
    .set('background-color', color)
    .duration(1000)
    .end();
}
