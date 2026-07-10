chrome.action.onClicked.addListener(async (windowTab) => {
  // 1. 全てのタブを取得してフィルタリング
  const allTabs = await chrome.tabs.query({ windowId: windowTab.windowId });

  const tabs = allTabs.filter(tab => {
    const isPinned = tab.pinned;
    // groupId が -1 つまり chrome.tabs.TAB_GROUP_ID_NONE ではない場合はグループ内
    const isInGroup = tab.groupId !== -1 && tab.groupId !== undefined;
    
    return !isPinned && !isInGroup;
  });

  if (tabs.length === 0) {
    return;
  }

  // 2. 最初のタブを使用して新しいウィンドウを作成
  const firstTab = tabs[0];
  const newWindow = await chrome.windows.create({
    tabId: firstTab.id
  });

  // 3. 残りを移動
  if (tabs.length > 1) {
    const remainingTabIds = tabs.slice(1).map(tab => tab.id);
    await chrome.tabs.move(remainingTabIds, {
      windowId: newWindow.id,
      index: -1
    });
  }
});
