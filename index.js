// 封装查找函数(查找单一元素)
function $(selector) {
  return document.querySelector(selector);
}

//获取需要操作的DOM元素
var chessBoard = $(".chessBoard"); //棋盘table

//定义需要使用的变量
var chessArr = []; //记录落子的信息数组
var whichOne = "white"; //一开始记录的是白色棋子
var isGameOver = false; //游戏是否结束

//初始化，绘制棋盘
function initChessBoard() {
  //记录棋盘内容
  var chessContent = "";

  //生成行
  for (var i = 0; i < 14; i++) {
    var row = "<tr>";
    //生成列
    for (var j = 0; j < 14; j++) {
      row += `<td data-row = ${i} data-line = ${j}></td>`;
    }
    row += "</tr>";
    chessContent += row; //加入生成好的每一行
  }

  //加入棋盘容器中
  chessBoard.innerHTML = chessContent;
}

//给棋盘绑定点击事件（事件委托）
function bindEvent() {
  //游戏没结束时，给棋盘中的td添加点击事件
  chessBoard.addEventListener("click", function (e) {
    if (!isGameOver) {
      if (e.target.tagName === "TD") {
        //记录点击的td的横row纵line坐标信息
        var temp = Object.assign({}, e.target.dataset);
        //计算td元素的边长
        var tdw = (chessBoard.clientWidth * 0.92) / 14;

        //判断鼠标点下的是在td的哪个位置（左上，左下，右上，右下）
        var positionX = e.offsetX > tdw / 2;
        var positionY = e.offsetY > tdw / 2;

        //生成棋子对象
        var chessPoint = {
          x: positionX ? parseInt(temp.line) + 1 : parseInt(temp.line),
          y: positionY ? parseInt(temp.row) + 1 : parseInt(temp.row),
          c: whichOne,
        };

        //绘制棋子
        chessMove(chessPoint);
      }
    } else {
      //游戏结束，会询问用户是否需要再来一局
      if (window.confirm("是否需要再来一局？")) {
        chessArr = []; //清空记录的落子信息
        initChessBoard(); //重新绘制棋盘
        isGameOver = false; //游戏开始
      }
    }
  });
}

//绘制棋子函数,接收一个棋子信息的对象
function chessMove(chessPoint) {
  //该位置没有棋子 且 游戏没有结束
  if (exist(chessPoint) && !isGameOver) {
    //将棋子推入记录信息中
    chessArr.push(chessPoint);

    //生成新的棋子div
    var newChess = `<div class="chess ${chessPoint.c}" data-row='${chessPoint.y}' data-line = '${chessPoint.x}'></div>`;

    //找到对应的td，将新棋子加入其中,并调整特殊位置的棋子
    //1.正常位置上的棋子,不做调整
    if (chessPoint.x < 14 && chessPoint.y < 14) {
      var tdPos = $(
        `td[data-row = '${chessPoint.y}'][data-line = '${chessPoint.x}']`
      );
      tdPos.innerHTML += newChess;
    }

    //2.x等于14，最右边的线
    if (chessPoint.x === 14 && chessPoint.y < 14) {
      var tdPos = $(`td[data-row = '${chessPoint.y}'][data-line = '13']`);
      tdPos.innerHTML += newChess;
      tdPos.lastChild.style.left = "50%";
    }

    //3.y等于14，最下边的线
    if (chessPoint.x < 14 && chessPoint.y === 14) {
      var tdPos = $(`td[data-row = '13'][data-line = '${chessPoint.x}']`);
      tdPos.innerHTML += newChess;
      tdPos.lastChild.style.top = "50%";
    }

    //4.x和y等于14，右下角的格子（可以放四颗棋子）
    if (chessPoint.x === 14 && chessPoint.y === 14) {
      var tdPos = $(`td[data-row = '13'][data-line = '13']`);
      tdPos.innerHTML += newChess;
      tdPos.lastChild.style.top = "50%";
      tdPos.lastChild.style.left = "50%";
    }

    //每生成一颗棋子就会换颜色
    whichOne = whichOne === "white" ? "black" : "white";
  }
  //每生成一颗棋子都要判断游戏是否结束
  check();
}

//判断数组中是否存在该棋子
function exist(chessPoint) {
  //item是数组的某一项，查找整个数组
  var result = chessArr.find(function (item) {
    return chessPoint.x === item.x && chessPoint.y === item.y;
  });
  //undefined就是没找到
  return result === undefined ? true : false;
}

//判断游戏是否结束函数
function check() {
  //遍历数组，判断是否有相连的五颗棋子（四种情况）
  for (var i = 0; i < chessArr.length; i++) {
    var curChess = chessArr[i]; //数组的某一项

    var chess2, chess3, chess4, chess5;

    //判断是否有五颗棋子相连（横着）
    chess2 = chessArr.find(function (item) {
      return (
        item.x === curChess.x + 1 &&
        item.y === curChess.y &&
        item.c === curChess.c
      );
    });

    chess3 = chessArr.find(function (item) {
      return (
        item.x === curChess.x + 2 &&
        item.y === curChess.y &&
        item.c === curChess.c
      );
    });

    chess4 = chessArr.find(function (item) {
      return (
        item.x === curChess.x + 3 &&
        item.y === curChess.y &&
        item.c === curChess.c
      );
    });

    chess5 = chessArr.find(function (item) {
      return (
        item.x === curChess.x + 4 &&
        item.y === curChess.y &&
        item.c === curChess.c
      );
    });

    if (chess2 && chess3 && chess4 && chess5) {
      //调用结束函数
      end(curChess, chess2, chess3, chess4, chess5);
    }

    //判断是否有五颗棋子相连（竖着）
    chess2 = chessArr.find(function (item) {
      return (
        item.x === curChess.x &&
        item.y === curChess.y + 1 &&
        item.c === curChess.c
      );
    });

    chess3 = chessArr.find(function (item) {
      return (
        item.x === curChess.x &&
        item.y === curChess.y + 2 &&
        item.c === curChess.c
      );
    });

    chess4 = chessArr.find(function (item) {
      return (
        item.x === curChess.x &&
        item.y === curChess.y + 3 &&
        item.c === curChess.c
      );
    });

    chess5 = chessArr.find(function (item) {
      return (
        item.x === curChess.x &&
        item.y === curChess.y + 4 &&
        item.c === curChess.c
      );
    });

    if (chess2 && chess3 && chess4 && chess5) {
      //调用结束函数
      end(curChess, chess2, chess3, chess4, chess5);
    }

    //判断是否有五颗棋子相连（斜着  斜率=1）
    chess2 = chessArr.find(function (item) {
      return (
        item.x === curChess.x + 1 &&
        item.y === curChess.y + 1 &&
        item.c === curChess.c
      );
    });

    chess3 = chessArr.find(function (item) {
      return (
        item.x === curChess.x + 2 &&
        item.y === curChess.y + 2 &&
        item.c === curChess.c
      );
    });

    chess4 = chessArr.find(function (item) {
      return (
        item.x === curChess.x + 3 &&
        item.y === curChess.y + 3 &&
        item.c === curChess.c
      );
    });

    chess5 = chessArr.find(function (item) {
      return (
        item.x === curChess.x + 4 &&
        item.y === curChess.y + 4 &&
        item.c === curChess.c
      );
    });

    if (chess2 && chess3 && chess4 && chess5) {
      //调用结束函数
      end(curChess, chess2, chess3, chess4, chess5);
    }

    //判断是否有五颗棋子相连（斜着 斜率 = -1）
    chess2 = chessArr.find(function (item) {
      return (
        item.x === curChess.x - 1 &&
        item.y === curChess.y + 1 &&
        item.c === curChess.c
      );
    });

    chess3 = chessArr.find(function (item) {
      return (
        item.x === curChess.x - 2 &&
        item.y === curChess.y + 2 &&
        item.c === curChess.c
      );
    });

    chess4 = chessArr.find(function (item) {
      return (
        item.x === curChess.x - 3 &&
        item.y === curChess.y + 3 &&
        item.c === curChess.c
      );
    });

    chess5 = chessArr.find(function (item) {
      return (
        item.x === curChess.x - 4 &&
        item.y === curChess.y + 4 &&
        item.c === curChess.c
      );
    });

    if (chess2 && chess3 && chess4 && chess5) {
      //调用结束函数
      end(curChess, chess2, chess3, chess4, chess5);
    }
  }
}

//游戏结束函数
function end() {
  //游戏没有结束时
  if (!isGameOver) {
    isGameOver = true; //游戏结束

    //将所有棋子都标记并展示出来，
    for (var i = 0; i < chessArr.length; i++) {
      //找到对应的div棋子
      var div = $(
        `div[data-row='${chessArr[i].y}'][data-line='${chessArr[i].x}']`
      );

      div.innerHTML += i + 1; //标记从1开始
    }

    //将获胜棋子显示出来，挂上获胜类（win)
    //获胜棋子的信息可以从传进来的参数中获取
    for (var i = 0; i < arguments.length; i++) {
      var winChess = $(
        `div[data-row='${arguments[i].y}'][data-line ='${arguments[i].x}']`
      );
      winChess.classList.add("win");
    }
  }
}

//1.游戏主函数，程序入口
function main() {
  //2.初始化，绘制棋盘
  initChessBoard();
  //3.绑定事件
  bindEvent();
}

main(); //一键启动
