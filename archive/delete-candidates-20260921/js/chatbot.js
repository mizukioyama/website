    jQuery(document).ready(function($) {
        const chatWindow = $('#chat');
        const categoryRadio = $('input[name="category"]');
        const keywordRadioContainer = $('.keyword-options'); // キーワード選択肢のコンテナ
        const sendButton = $('#send-button');
        const clearButton = $('#clear-button');
    
        const maxResponses = 5;
        const responses = [];
    
        sendButton.on('click', sendMessage);
        clearButton.click(clearChat);
    
        function sendMessage() {
        const selectedCategory = categoryRadio.filter(':checked').val();
        if (!selectedCategory) return;
    
        const selectedKeyword = keywordRadioContainer.find('input[name="keyword"]:checked').val();
        if (!selectedKeyword) {
            appendMessage('bot', "キーワードを選択してください。");
            return;
        }
    
        const botResponse = generateResponse(selectedCategory, selectedKeyword);
    
        appendMessage('bot', botResponse);
        responses.push({ botResponse });
    
        displayResponses();
        }
    
        function clearChat() {
        chatWindow.html('');
        responses.length = 0;
        }
    
        function appendMessage(sender, message) {
        const messageDiv = $('<div>').addClass(sender).text(message);
        chatWindow.append(messageDiv);
        chatWindow.scrollTop(chatWindow[0].scrollHeight);
        }
    
        function displayResponses() {
        chatWindow.html('');
        for (const response of responses) {
            appendMessage('bot', response.botResponse);
        }
        }
    
        function generateResponse(selectedCategory, selectedKeyword) {
        let response = '';
    
        if (selectedCategory === '作家について') {
            response = generateAuthorResponse(selectedKeyword);
        } else if (selectedCategory === '作品について') {
            response = generateArtworkResponse(selectedKeyword);
        } else if (selectedCategory === '展示について') {
            response = generateExhibitionResponse(selectedKeyword);
        } else {
            response = "選択したカテゴリーに関する解答内容です。";
        }
    
        return response;
        }
    
        function generateAuthorResponse(selectedKeyword) {
        // 著者に関する解答を生成するロジックをここに追加
        if (selectedKeyword === '著者（小山 瑞樹）') {
            return "著者（小山瑞樹）はAbstract Artistとして宮城県を拠点に活動しています.";
        } else if (selectedKeyword === '著者の考えるArt') {
            return "著者はArtには人間の脳を変化させる可能性を感じて意図的に抽象的な作品を制作しています. 細かい内容はProfileページに記載しています.";
        } else if (selectedKeyword === '画歴') {
            return "出展 2021/08（あべのハルカス）,2021/11（フランス）,2022/04（東京：日アセアンセンター）,2022/11（日光東照宮美術館）,2023/06（フランス）| 賞/認定 2022：徳川家康作家之賞, 2022/：日本・モンゴル外交関係樹立50周年記念事業認定 2021：TAJO (トスカーナ芸術鑑定機構) ピエールジャコモ・ペトリオーリ博士による、「Artista del post luminescenza e sole bianco.【残照と白日の芸術家】」認定 2016年：第67回宮城県高等学校美術展（優秀賞）賞 詳しくはProfileページでご覧いただけます.";
        } else {
            return "選択したKey wordに関する解答内容はありません.";
        }
        }
    
    
        function generateArtworkResponse(selectedKeyword) {
        // 作品に関する解答を生成するロジックをここに追加
        if (selectedKeyword === 'Art Gallery') {
            return "Gallery情報は都度Informationページでお知らせします. これまで制作した作品は Art Index. ページで閲覧可能です.";
        } else if (selectedKeyword === '作品ジャンル') {
            return "作品ジャンルは抽象です. 絵の具, キャンバス, 木材, 布, 鉄, 釘, 水水, 草, 写真, デジタル, 映像, 等様々な素材を使用して作品を制作しています.";
        } else if (selectedKeyword === 'Theme') {
            return "作品ThemeはParadigm Natureです. Paradigm(Paradigm Nature), 自然はパラダイム「物の見方や捉え方」を起こすとあ考えています. 自然に触れることで今の自分にない視点や考え方を発掘できる脳のゆるみを与え, 物の見方や捉え方が変化していくと思いパラダイムネイチャーというThemeにしました. 既存の枠組みや考え方にとらわれず, 自然から学び, 洞察し, 新たな視点を見出すことを追求する. 既知の概念を超えて, 自然の複雑さや美しさを探求し, 新たな洞察や気づきを得ることができます. また, 自然という大いなる存在から学びながら, 私たちの考え方や行動を変え, 持続可能な未来を築くためのアイデアやソリューションを見つけることができるでしょう.";
        } else if (selectedKeyword === 'Genre') {
            return "抽象表現主義に当てはまると思います. 作品は全て抽象ですが, 平面, 立体, メディアアート, ファインアート, シネマグラフ等を制作しています.";
        } else {
            return "選択したキーワードに関する解答内容はありません。";
        }
        }
    
        function generateExhibitionResponse(selectedKeyword) {
        // 展示に関する解答を生成するロジックをここに追加
        if (selectedKeyword === '展示') {
            return "通常の通常の展示についてはInformationページに記載します. 独自に行う Digital 展示の閲覧は公開中に Art Gallery ページの Digital 展示ページで閲覧可能です. 展示期間が終了したら Art Index ページに投稿します.";
        }
        }
    
        // カテゴリーが変更されたときにキーワードの選択肢を更新
        categoryRadio.on('change', function() {
        updateKeywordOptions();
        });
    
        // キーワードの選択肢を更新する関数
        function updateKeywordOptions() {
        const selectedCategory = categoryRadio.filter(':checked').val();
        const keywordOptions = getKeywordsForCategory(selectedCategory);
    
        // キーワード選択肢を更新
        keywordRadioContainer.empty();
        for (const keyword of keywordOptions) {
            const label = $('<label>').html(`<input type="radio" name="keyword" value="${keyword}"> ${keyword}`);
            keywordRadioContainer.append(label);
        }
        }
    
        // カテゴリーに応じたキーワードのリストを返す関数
        function getKeywordsForCategory(selectedCategory) {
        if (selectedCategory === '作家について') {
            return ['著者（小山 瑞樹）', '著者の考えるArt', '画歴'];
        } else if (selectedCategory === '作品について') {
            return ['Art Gallery', 'Genre', '制作方法'];
        } else if (selectedCategory === '展示について') {
            return ['展示'];
        } else {
            return [];
        }
        }
    });
    