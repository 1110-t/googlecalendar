class Calendar {
  constructor() {
    this.y = 0;
    this.m = 0;
    this.week = ["日", "月", "火", "水", "木", "金", "土"];
    this.event = "";
    this.time = {start:0,end:24};
  }
  create(...theArgs){
    let year = 0;
    let month = 0;
    if(theArgs[0]){
      year = theArgs[0];
      month = theArgs[1];
      month -= 1;
      this.y = year;
      this.m = month;
    };
    // スケジュールがすでにあるかどうか
    let table = document.querySelector("table");
    if(table){
      table.remove();
    };

    let instance = "<table><tr>";
    for (var i = 0; i < this.week.length; i++) {
      instance += "<th>" + this.week[i] + "</th>";
    };
    instance += "</tr>"
    // 指定月の最初の曜日を取得
    const startDayOfWeek = new Date(this.y, this.m, 1).getDay();
    // 最終日を取得する
    const endDate = new Date(this.y, this.m + 1, 0).getDate();
    // 指定月の最後の曜日を取得
    const lastMonthEndDate = new Date(this.y, this.m, 0).getDate();
    // 何週まであるか
    const row = Math.ceil((startDayOfWeek + endDate) / this.week.length);
    //
    let count = 0;
    for (let i = 0; i < row; i++) {
      instance += "<tr>";
      for (var j = 0; j < this.week.length; j++) {
        // 最初の週であり、まだ最初の曜日に至らない間
        if (i == 0 && j < startDayOfWeek) {
          // 前の月の曜日を表示する
          instance += "<td class='disabled'>" + (lastMonthEndDate - startDayOfWeek + j + 1) + "</td>";
        } else if (count >= endDate){
          // 最終行で最終日以降は次の月の日付を表示する
          count++;
          instance += "<td class='disabled'>" + (count - endDate) + "</td>";
        } else {
          // それ以外は通常に日にちを入力
          count++;
          instance += "<td><div class='d"+count+"'>" + count + "</div><p date='d"+ count +"'>"
          // 時間配列を要素として保持する
          // <p><span time='6'></span><span time='7'></span></p>
          for (var g = this.time.start; g <= this.time.end; g++) {
            if(g != 24){
              instance += "<span id='h" + g +"'><span minites='m0'></span><span minites='m15'></span><span minites='m30'></span><span minites='m45'></span></span>";
            } else {
              instance += "<span id='h" + g +"'><span minites='m0'></span></span>";
            };
          };
          instance += "</p></td>";
        };
      };
      instance += "</tr>";
    };
    instance += "</table>"
    let calendar = document.querySelector(".calendar__body");
    calendar.innerHTML = instance;
  }

  change(degree){
    this.m += degree;
    if(this.m >= 12){
      this.m = 0;
      this.y = parseInt(this.y) + 1;
    } else if(this.m < 0){
      this.m = 11;
      this.y = parseInt(this.y) - 1;
    }
    this.display(this.y,this.m+1);
    this.create();
  }

  display(y,m){
    // 表示の切り替え
    let ele_y = document.getElementById("year");
    let ele_m = document.getElementById("month");
    ele_y.textContent = y;
    ele_m.textContent = m;
    let pointer = new getFetch();
    let date = new Date( y, m, 0 ) ;
    let lastDay = date.getDate() ;
    console.log("../Common.php?getoradd=get&start="+y+"-"+m+"-01&end=2023-8-01");
    pointer.connect("../Common.php?getoradd=get&start="+y+"-"+m+"-01&end="+y+"-"+m+"-"+lastDay).then(
        function(info){
            console.log(info);
            let p_day = 0;
            // カウンター
            let counter = 0;
            info.forEach((item, i) => {
              let s = new Date(item.start);
              let e = new Date(item.end);
              // カレンダー中の日付を取得する
              let day = s.getDate();
              // 最初の日だけ取得する
              if(i == 0){
                p_day = day;
              };
              // 日付の要素を取得する
              let ele = document.querySelector(".d"+day);
              ele = ele.closest("td");
              ele = ele.querySelector("p");
              // 始まりの時間の時間と分数を取得する
              let s_h = s.getHours();
              let s_m = s.getMinutes();
              // 始まりの時間と、終わりの時間までの差（分数）を取得する
              let dif_m = (e - s)/1000/60
              // 始まりの時間から差分を要素に格納する
              while(dif_m > 0){
                let start = ele.querySelector("#h"+s_h);
                start.querySelector("[minites=m"+s_m+"]").textContent = '✓';
                counter += 1;
                s_m += 15;
                if(s_m == 60){
                  s_m = 0;
                  s_h += 1;
                };
                dif_m -= 15;
              };
              // 1/4まで◎　1/2 〇 3/4で △ 4/4で×
              // 総数
              if(p_day != day){
                let all = (c.time.end - c.time.start)*4;
                let ele_ = document.querySelector(".d"+day);
                ele_ = ele_.closest("td");
                let cond = document.createElement("div");
                let judge = counter / all;
                if(judge < 1/4){
                  cond.textContent = "◎";
                } else if(judge < 1/2){
                  cond.textContent = "〇";
                } else if(judge < 3/4){
                  cond.textContent = "△";
                } else if(judge == 1){
                  cond.textContent = "×";
                };
                ele_.appendChild(cond);
                counter = 0;
                p_day = day;
              };
            });
        }
    )
    console.log(this.event);
  }
}

// 今日
const nowDate = new Date();
// 今月
const nowMonth = nowDate.getMonth() + 1;
// 今年
const nowYear = nowDate.getFullYear().toString();
let c = new Calendar();
c.display(nowYear,nowMonth);
c.create(nowYear,nowMonth);

startHour = "";
class Day{
  constructor(day_element) {
    this.day_element = day_element;
    this.time_parse = 4;
    this.time_length = 120/15;
    this.span = 2;
    this.startHour = 0;
    this.startMinites = 0;
  };
  // カレンダー上の日付が選択された場合に、最初の時間選択のselectを生成する
  createHourSelector(){
    // すべての時間帯および分数のデータを取得する
    let all_time = this.day_element.querySelectorAll("span span");
    let select = document.createElement("select");
    all_time.forEach((item,i) => {
      let counter = 0;
      // 15分刻みで最低利用時間の２時間分の間があるかチェックしていく
      for (var j = 0; j < this.time_length; j++) {
        // ２時間後が、一日の終わりの時間を超えていなければ処理を行う
        if(all_time[i+j+1] != undefined){
          // 予定があいており、次のステップの時間の予定もあいている場合
          if(item.textContent == "" && all_time[i+j+1].textContent == ""){
            counter += 1;
            // ２時間後の指定になったとき
            if(counter == 8){
              counter = 0;
              let h = item.parentNode.getAttribute("id").replace("h","");
              let m = item.getAttribute("minites").replace("m","");
              // まだオプションタグとして時間選択の要素がない場合
              if(!select.querySelector("[hours=h"+h+"]")){
                let opt = document.createElement("option");
                opt.setAttribute("value",h);
                opt.textContent = h;
                opt.setAttribute("hours","h"+h);
                opt.setAttribute("minites",m);
                select.appendChild(opt);
              // 時間選択の要素がある場合
              } else {
                let opt = select.querySelector("[hours=h"+h+"]");
                let minites = opt.getAttribute("minites");
                minites = minites+" "+m;
                opt.setAttribute("minites",minites);
              };
            };
          };
        };
      };
      // 用事が入っている場合
      if(item.textContent != ""){
        let h = item.parentNode.getAttribute("id").replace("h","");
        let m = item.getAttribute("minites").replace("m","");
        // 用事の一番最初の時刻を登録する
        if(!select.querySelector("[hour=h"+h+"]")){
          let end_time = document.createElement("div");
          end_time.setAttribute("hour","h"+h);
          end_time.setAttribute("minite","m"+m);
          select.appendChild(end_time);
        };
      };
    });
    // セレクタ―について出来上がったらフッターに追加する
    let calendar__footer = document.querySelector(".calendar__footer");
    calendar__footer.innerHTML = "";
    select.classList.add("hourSelector");
    select.addEventListener("change",Day.prototype.createMiniteSelector);
    calendar__footer.appendChild(select);
  };
  // 時間の次に分数を選択する画面を生成する
  createMiniteSelector(){
    // 選択されたオプションの値を取得する
    let val = this.selectedOptions[0].value;
    startHour = val;
    // 適応する分数を取得する
    let minites = this.selectedOptions[0].getAttribute("minites");
    minites = minites.split(" ");
    let select = document.createElement("select");
    select.classList.add("miniteSelector");
    // 時間に紐づいて対応する分数を挿入する
    minites.forEach((minite, i) => {
      select.innerHTML += "<option value='"+minite+"'>"+minite+"</option>";
    });
    let calendar__footer = document.querySelector(".calendar__footer");
    // 選択されたら、次に終わりの時間を選択できる要素を生成する
    select.addEventListener("change",Day.prototype.createEndHourSelector);
    calendar__footer.appendChild(select);
  };
  // 終わりの時間を選択できるように生成する
  createEndHourSelector(){
    let val = this.selectedOptions[0].value;
    let startMinites = parseInt(val);
    // 開始できる時刻を設定する
    let minStart = parseInt(startHour) + 2;
    let selector = document.querySelector(".hourSelector");
    // 終了時刻を新しいセレクタ―として作成する
    let select = document.createElement("select");
    select.classList.add("endHourSelector");
    // 最小時間の時間と分数で予定があるかどうかチェックする
    for (var i = minStart; i < 24; i++) {
      let temp = selector.querySelector("[hour=h"+i+"]");
      // その時間の予定がなければ
      if(!temp){
        select.innerHTML += "<option value="+i+" minites='0 15 30 45'>"+i+"</option>"
      // その時間の予定があった場合、何分まで大丈夫か
      } else {
        let tempMinites = parseInt(temp.getAttribute("minite").replace("m",""));
        // [0,15,30,45]
        let tempMinitesArray = [0,15,30,45];
        if(startMinites < tempMinites){
          let option = "<option value='"+i+"' minites='";
          let index1 = tempMinitesArray.indexOf(startMinites);
          let index2 = tempMinitesArray.indexOf(tempMinites);
          tempMinitesArray = tempMinitesArray.slice(index1,index2);
          tempMinitesArray.forEach((temp,j) => {
            if(j != (tempMinitesArray.length - 1)){
              option += (temp + " ");
            } else {
              option += (temp + "'");
            };
          });
          option += (">"+ i +"</option>");
          select.innerHTML += option;
        };
      }
    };
    console.log(select);
    let calendar__footer = document.querySelector(".calendar__footer");
    select.addEventListener("change",Day.prototype.createEndMiniteSelector);
    calendar__footer.appendChild(select);
  };
  createEndMiniteSelector(){
    // 選択されたオプションの値を取得する
    let val = this.selectedOptions[0].value;
    selectDay.ystartHour = val;
    // 適応する分数を取得する
    let minites = this.selectedOptions[0].getAttribute("minites");
    minites = minites.split(" ");
    let select = document.createElement("select");
    select.classList.add("miniteSelector");
    minites.forEach((minite, i) => {
      select.innerHTML += "<option value='"+minite+"'>"+minite+"</option>";
    });
    let calendar__footer = document.querySelector(".calendar__footer");
    calendar__footer.appendChild(select);
  };
};


let calendar_body = document.querySelector(".calendar__body");
selectDay = "";
calendar_body.addEventListener("click",function(e){
  let day_element = e.target.closest("td");
  // その月の日付かチェック
  if(!day_element.classList.contains("disabled")){
    selectDay = new Day(day_element);
    selectDay.createHourSelector();
  };
});
