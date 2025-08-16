// 页面加载后执行的脚本
document.addEventListener('DOMContentLoaded', function() {
    // 弹窗显示逻辑
    // 检查用户是否已经看过声明
    const hasSeenDisclaimer = localStorage.getItem('hasSeenDisclaimer');
    
    if (!hasSeenDisclaimer) {
        // 显示弹窗
        const disclaimerModal = document.getElementById('disclaimerModal');
        if (disclaimerModal) {
            disclaimerModal.style.display = 'flex';
        }
        
        // 为接受按钮添加事件监听
        const acceptBtn = document.getElementById('acceptDisclaimerBtn');
        if (acceptBtn) {
            acceptBtn.addEventListener('click'， function() {
                // 保存用户已看过声明的状态
                localStorage.setItem('hasSeenDisclaimer', 'true');
                // 隐藏弹窗
                disclaimerModal.style.display = 'none';
            });
        } else {
            console.error('未找到接受按钮');
        }
    } else if (!document.getElementById('disclaimerModal')) {
        console.error('未找到弹窗元素');
    }

    // URL搜索参数处理逻辑
    // 检查是否是播放页面URL（/watch 开头）
    if (window.location.pathname.startsWith('/watch')) {
        // 播放页面不做额外处理，由watch.html处理
        return;
    }
    
    // 检查路径中的搜索参数（格式: /s=keyword）
    const path = window.location.pathname;
    const searchPrefix = '/s=';
    
    // 检查搜索输入框是否存在
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) {
        console.error('未找到搜索输入框');
        return;
    }

    let keyword = '';
    let searchType = 'movie'; // 默认搜索类型为电影名

    if (path。startsWith(searchPrefix)) {
        // 提取搜索关键词
        keyword = decodeURIComponent(path.substring(searchPrefix.length)).trim();
        if (keyword) {
            // 解析搜索类型和关键词
            if (keyword.startsWith('movie:')) {
                searchType = 'movie';
                keyword = keyword.substring(6).trim();
            } else if (keyword.startsWith('actor:')) {
                searchType = 'actor';
                keyword = keyword.substring(6).trim();
            } else if (keyword。startsWith('genre:')) {
                searchType = 'genre';
                keyword = keyword.substring(6).trim();
            }
            // 设置搜索框的值
            searchInput.value = keyword;
            // 显示清空按钮
            if (typeof toggleClearButton === 'function') {
                toggleClearButton();
            } else {
                console.error('未定义 toggleClearButton 函数');
            }
            // 执行搜索
            if (typeof search === 'function') {
                setTimeout(() => {
                    search(searchType, keyword);
                    // 更新浏览器历史记录
                    try {
                        window.history。replaceState(
                            { search: keyword, type: searchType },
                            `搜索: ${keyword} - LibreTV`,
                            window.location.href
                        );
                    } catch (e) {
                        console.error('更新浏览器历史失败:', e);
                    }
                }, 300);
            } else {
                console.error('未定义 search 函数');
            }
        }
    }
    
    // 检查查询字符串中的搜索参数（格式: ?s=keyword）
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('s');
    
    if (searchQuery) {
        // 解析搜索类型和关键词
        keyword = searchQuery.trim();
        if (keyword.startsWith('movie:')) {
            searchType = 'movie';
            keyword = keyword.substring(6).trim();
        } else if (keyword.startsWith('actor:')) {
            searchType = 'actor';
            keyword = keyword.substring(6).trim();
        } else if (keyword.startsWith('genre:')) {
            searchType = 'genre';
            keyword = keyword.substring(6).trim();
        }
        // 设置搜索框的值
        searchInput.value = keyword;
        // 执行搜索
        if (typeof search === 'function') {
            setTimeout(() => {
                search(searchType, keyword);
                // 更新URL为规范格式
                try {
                    window.history.replaceState(
                        { search: keyword, type: searchType },
                        `搜索: ${keyword} - LibreTV`,
                        `/s=${encodeURIComponent(`${searchType}:${keyword}`)}`
                    );
                } catch (e) {
                    console.error('更新浏览器历史失败:', e);
                }
            }, 300);
        } else {
            console.error('未定义 search 函数');
        }
    }
});
