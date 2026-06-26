chrome.action.onClicked.addListener(async (windowTab) => {
  // 1. 現在のウィンドウの「固定されていない」タブをすべて取得
  const tabs = await chrome.tabs.query({
    windowId: windowTab.windowId,
    pinned: false
  });

  if (tabs.length === 0) {
    return;
  }

  // 2. 最初のタブを使用して新しいウィンドウを作成する
  // (注: 最初のタブのIDを渡すと、そのタブが移動した状態でウィンドウが作られます)
  const firstTab = tabs[0];
  const newWindow = await chrome.windows.create({
    tabId: firstTab.id
  });

  // 3. 残りのタブがある場合は、新しいウィンドウにまとめて移動
  if (tabs.length > 1) {
    const remainingTabIds = tabs.slice(1).map(tab => tab.id);
    await chrome.tabs.move(remainingTabIds, {
      windowId: newWindow.id,
      index: -1 // 末尾に追加
    });
  }
});
