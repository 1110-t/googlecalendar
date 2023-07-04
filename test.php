<?php
  // require_once __DIR__.'/Common.php';
  // $test = new Common();
  // まず今月の予定を全て取得する
  // phpからのデータを受け取るjavascriptがいる
  // $test->getCalendar('2023-06-01');
  // $test->addCalendar();
?>
<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <script type="text/javascript" defer src="./js/fetch.js"></script>
    <script type="text/javascript" defer src="./js/calendar.js"></script>
  </head>
  <body>
    <div class="calendar">
      <div class="calendar__header">
        <button id="prev" onclick="c.change(-1)">‹</button>
        <span id="year">0000</span>/<span id="month">00</span>
        <button id="next" onclick="c.change(1)">›</button>
      </div>
      <div class="calendar__body">
      </div>
    </div>
  </body>
</html>
