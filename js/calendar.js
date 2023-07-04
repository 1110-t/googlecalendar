class Calendar {
  constructor() {
    this.y = 0;
    this.m = 0;
    this.week = ["日", "月", "火", "水", "木", "金", "土"];
    this.event = "";
    this.time = {start:0,end:23};
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
            instance += "<span id='h" + g +"'><span minites='m0'></span><span minites='m15'></span><span minites='m30'></span><span minites='m45'></span></span>";
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
            info.forEach((item, i) => {
              let s = new Date(item.start);
              let e = new Date(item.end);
              // カレンダー中の日付を取得する
              let day = s.getDate();
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
                s_m += 15;
                if(s_m == 60){
                  s_m = 0;
                  s_h += 1;
                };
                dif_m -= 15;
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