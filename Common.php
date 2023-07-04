<?php
  class Common{
    /*
     * 共通の記述
     */
    private $aimJsonPath;
    private $client;
    public function __construct(){
      // composerでインストールしたライブラリを読み込む
      require_once __DIR__.'/vendor/autoload.php';
      // サービスアカウント作成時にダウンロードしたjsonファイル
      $this->aimJsonPath = __DIR__ . '/sonic-name-391810-1356b8e73314.json';
      // サービスオブジェクトを作成
      $this->client = new Google_Client();
      // このアプリケーション名
      $this->client->setApplicationName('カレンダー操作テスト イベントの取得');
      // カレンダーID
      $this->calendarId = 'teruo.nakanishi.1267@gmail.com';
    }

    public function common($getOradd){
      switch($getOradd){
        case "get":
          // ※ 注意ポイント: 権限の指定
          // 予定を取得する時は Google_Service_Calendar::CALENDAR_READONLY
          // 予定を追加する時は Google_Service_Calendar::CALENDAR_EVENTS
          $this->client->setScopes(Google_Service_Calendar::CALENDAR_READONLY);
        case "add":
          $this->client->setScopes(Google_Service_Calendar::CALENDAR_EVENTS);
        // ユーザーアカウントのjsonを指定
        $this->client->setAuthConfig($this->aimJsonPath);
        // サービスオブジェクトの用意
        $service = new Google_Service_Calendar($this->client);
        return $service;
      }
    }

    public function getCalendar($startYMD,$endYMD){
      $service = $this->common("get");
      // 取得時の詳細設定
      $optParams = array(
          'maxResults' => 9999,
          'orderBy' => 'startTime',
          'singleEvents' => true,
          'timeMin' => date('c',strtotime($startYMD)),
          'timeMax' => date('c',strtotime($endYMD)),
      );
      // 情報を取得する
      $results = $service->events->listEvents($this->calendarId, $optParams);
      $events = $results->getItems();
      /*
        返り値は[{start=>date,end=>date},{...}]
      */
      $eventsArray = [];
      foreach ($events as $event) {
        $temp = array(
          'start' => $event->start->dateTime,
          'end' => $event->end->dateTime
        );
        $eventArray[] = $temp;
      }
      return($eventArray);
    }

    public function addCalendar(){
      $service = $this->common("add");
      $event = new Google_Service_Calendar_Event(array(
          'summary' => 'テストの予定を登録するよ6', //予定のタイトル
          'start' => array(
              'dateTime' => '2023-06-01T10:00:00+09:00',// 開始日時
              'timeZone' => 'Asia/Tokyo',
          ),
          'end' => array(
              'dateTime' => '2023-06-01T11:00:00+09:00', // 終了日時
              'timeZone' => 'Asia/Tokyo',
          ),
      ));
      $event = $service->events->insert($this->calendarId, $event);
    }

  }

  $calendar = new Common();
  if(isset($_GET["getoradd"])){
    if($_GET["getoradd"] == 'get' && isset($_GET["start"]) && isset($_GET["end"])){
      $eventArray = $calendar->getCalendar($_GET["start"],$_GET["end"]);
      echo(json_encode($eventArray));
      exit();
    };
  };
 ?>
