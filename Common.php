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
      $this->aimJsonPath = __DIR__ . '/calendar-389902-56d8e90c6104.json';
      // サービスオブジェクトを作成
      $this->client = new Google_Client();
      // このアプリケーション名
      $this->client->setApplicationName('カレンダー操作テスト イベントの取得');
      // カレンダーID
      $this->calendarId = '2e18b7f17259045d9a92c68b3a251d3be28976e2943eb8d84aa25f67bbbcda00@group.calendar.google.com';
    }

    public function getCalendar($ymd){
      // ※ 注意ポイント: 権限の指定
      // 予定を取得する時は Google_Service_Calendar::CALENDAR_READONLY
      // 予定を追加する時は Google_Service_Calendar::CALENDAR_EVENTS
      $this->client->setScopes(Google_Service_Calendar::CALENDAR_READONLY);
      // ユーザーアカウントのjsonを指定
      $this->client->setAuthConfig($this->aimJsonPath);
      // サービスオブジェクトの用意
      $service = new Google_Service_Calendar($this->client);
      // 取得時の詳細設定
      $optParams = array(
          'maxResults' => 9999,
          'orderBy' => 'startTime',
          'singleEvents' => true,
          'timeMin' => date('c',strtotime($ymd)),//2019年1月1日以降の予定を取得対象
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
      var_dump($eventArray);
      return($eventArray);
    }

  }
 ?>
