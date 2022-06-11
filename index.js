"use strict";

let round = 0;			//何ラウンド目か
let questions = [];		//問題(どのボタンが光るか)を格納した配列
let qCount = 0;			//あるラウンドにおいて何番目のボタンか
let qTimer = NaN;		//あるラウンドでボタンが光る間隔を調整するタイマー
let answers = [];		//プレーヤーが答えたボタンを格納する配列
let sounds = [];		//効果音のオブジェクトを格納する配列

function gobj(id) {
	return document.getElementById(id);
}

//初期化
function init() {
	//すべてのボタンへの参照を取得
	let buttons = document.querySelectorAll("button");
	//各ボタンにイベントハンドラを設定
	for (let i = 0; i < buttons.length; i++) {
		//ボタン押下時の処理
		buttons[i].onclick = function (e) {
			//タイマー稼働中は何もしない
			if (qTimer) {
				return;
			}
			//どのボタンが押下されたか
			let index = e.target.id.charAt(1);
			//光る効果を演出
			blink(index);
			//解答内容を保存
			answer(index);
		};
		sounds[i] = new Audio("sound" + (i + 1) + ".mp3");
		sounds[i].preload = "auto";
		sounds[i].load();
	}
	nextRound();
}

//引数の文字列を画面に表示する
function showMessage(mess) {
	gobj("message").textContent = mess;
}

//引数で指定された番号のボタンを一時的に光らせて音を鳴らす
function blink(index) {
	//押下されたときの色
	let fgcolors = ["#F00", "#FF0", "#0F0", "#00F"];
	//通常時の色
	let bgcolors = ["#600", "#660", "#060", "#006"];
	//選ばれたボタンの背景色を変更
	gobj("b" + index).style.backgroundColor = fgcolors[index];
	sounds[index].currentTime = 0;
	sounds[index].play();
	//400msec後にすべてのボタンの色を戻す
	setTimeout(function () {
		for (let i = 0; i < 4; i++) {
			gobj("b" + i).style.backgroundColor = bgcolors[i];
		}
	}, 400);
}

//次のラウンドへ進む処理
function nextRound() {
	round++;
	showMessage("round:" + round);
	//乱数で0〜3までの数値を発生させる
	let r = Math.floor(Math.random() * 4);
	//乱数を配列questionsに追加
	questions[questions.length] = r;
	//回答を格納する配列answersをクリア
	answers = [];
	//何番目のボタンかを示すqCountを0で初期化
	qCount = 0;
	//タイマーを開始
	//600msecの間隔で呼び出し
	qTimer = setInterval(showQuizItem, 600);
}

//出題中に一定間隔で呼び出し
function showQuizItem() {
	//ボタンを点灯
	blink(questions[qCount]);
	//ラウンドにおける出題数の上限に達したら
	if (++qCount >= questions.length) {
		//タイマーを停止
		clearInterval(qTimer);
		qTimer = NaN;
		showMessage("start answer");
	}
}

//ボタン押下時に呼び出し
function answer(val) {
	//解答を追加
	answers.push(val);
	let mistake = false;
	//これまでの解答に間違いがなかったかチェック
	for (let i = 0; i < answers.length; i++) {
		if (answers[i] != questions[i]) {
			mistake = true;
			break;
		}
	}
	if (mistake) {
		showMessage("Game Over:" + round);
	}
	else if (answers.length == questions.length) {
		showMessage("GOOD");
		//2000msec後に次のラウンドを開始
		setTimeout(nextRound, 2000);
	}
}