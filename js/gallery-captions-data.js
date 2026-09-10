document.addEventListener("DOMContentLoaded", () => {
  const modalBox = document.getElementById("modalBox");
  if (!modalBox) return;

  const captions = [
    {
      jaTitle: "蒼縁", enTitle: "sōen",
      ja: "青の奥に広がる、まだ言葉にならないつながり。人と自然、記憶と感情、現在と未来のあいだに生まれる見えない縁を、ひとつの感覚として捉えた作品。境界を決めるのではなく、静かに重なり合う関係性そのものを見つめている。",
      en: "A connection that has not yet become language spreads through the depth of blue. This work considers the invisible ties between people and nature, memory and emotion, the present and the future. Rather than defining boundaries, it looks quietly at relationships as they overlap and continue to change."
    },
    {
      jaTitle: "海淵", enTitle: "Kaien",
      ja: "海の深さを思うとき、そこには静けさと未知が同時に存在する。見えている水面の向こうに広がる、触れることのできない領域。その距離を、心の深部に沈む記憶や感情と重ねながら構成した。",
      en: "When thinking about the depth of the sea, stillness and the unknown exist at the same time. Beyond the visible surface lies a realm that cannot be touched directly. This work connects that distance with memories and emotions that remain deep within the mind."
    },
    {
      jaTitle: "#2504", enTitle: "#2504",
      ja: "生成と加工を往復しながら、偶然に現れた形と自分の感覚との距離を探った。意図してつくる部分と、予期せず生まれる部分。その境界を残すことで、完成を固定せず、見る側の想像が入り込む余白をつくっている。",
      en: "Moving back and forth between generation and processing, this work explores the distance between accidental forms and personal perception. By keeping both intentional and unexpected elements visible, the image remains open rather than fixed, leaving room for the viewer's imagination."
    },
    {
      jaTitle: "#2503", enTitle: "#2503",
      ja: "ひとつのイメージが生まれ、加工によって別の表情へ移り変わっていく過程に着目した作品。最初に与えられた形を完成形とせず、変化の途中に現れる違和感や揺らぎを、新しい像として受け取っている。",
      en: "This work focuses on the process in which one image is born and then changes through editing. Instead of treating the initial form as complete, it accepts the discomfort and fluctuation that appear during transformation as a new image in themselves."
    },
    {
      jaTitle: "#2501", enTitle: "#2501",
      ja: "生成された像を出発点に、自分の感覚へ近づけるための加工を重ねた。AIが示す可能性をそのまま受け入れるのではなく、選択と修正を繰り返すことで、作者と生成技術のあいだに生まれる表現の輪郭を探っている。",
      en: "Beginning with a generated image, repeated processing brings it closer to the artist's own perception. Rather than accepting the possibilities proposed by AI as they are, the work explores the outline of expression that emerges through repeated selection and revision."
    },
    {
      jaTitle: "時間と変化", enTitle: "Time and change",
      ja: "同じものを見ていても、時間が変われば受け取る感覚も変わっていく。記憶、経験、環境によって更新され続ける見え方を、変化そのものとして捉えた作品。固定された答えではなく、時間の中で移ろう認識を見つめている。",
      en: "Even when we look at the same thing, what we receive from it changes with time. This work considers perception as something continually renewed by memory, experience, and environment, focusing not on a fixed answer but on awareness as it shifts through time."
    },
    {
      jaTitle: "#2403", enTitle: "#2403",
      ja: "デジタル空間では、形は固定されず何度でも変化できる。その性質を利用し、生成された像を加工しながら、現実には存在しない感覚の輪郭を探った。見慣れたものと未知のものが重なる瞬間を残している。",
      en: "In digital space, form is never completely fixed and can be transformed again and again. By processing a generated image, this work searches for the outline of a sensation that does not exist in physical reality, preserving the moment when the familiar and the unknown overlap."
    },
    {
      jaTitle: "#2402", enTitle: "#2402",
      ja: "生成AIによる偶然性と、作者による選択・加工を重ねて構成した。どこまでが機械による生成で、どこからが人の意思なのか。その境界を曖昧に保ちながら、新しいイメージの生まれ方を考えている。",
      en: "This work combines the chance produced by generative AI with the artist's selection and processing. By keeping the boundary between machine generation and human intention deliberately uncertain, it considers how new images can come into being."
    },
    {
      jaTitle: "#2401", enTitle: "#2401",
      ja: "頭の中にある曖昧な像を、生成と加工を通して外側へ取り出す試み。明確なモチーフを説明するのではなく、言葉に置き換える前の感覚を視覚として留めることを意識して制作した。",
      en: "An attempt to bring an indistinct inner image outward through generation and processing. Rather than explaining a clear motif, the work tries to preserve a sensation visually before it is translated into words."
    },
    {
      jaTitle: "#2342", enTitle: "#2342",
      ja: "形を決めすぎず、見る側の想像によって意味が変わる状態を残した。生成された像に加工を重ねることで、現実と非現実の境目をぼかし、ひとつの答えに収束しない視覚体験をつくっている。",
      en: "The image avoids becoming too fixed, allowing its meaning to change through the viewer's imagination. By repeatedly processing a generated form, the work blurs the boundary between reality and unreality and resists settling into a single interpretation."
    },
    {
      jaTitle: "#2341", enTitle: "#2341",
      ja: "目に映る形だけではなく、その形から生まれる感覚に焦点を置いた。生成と加工によって像を変化させながら、見る人の記憶や経験によって異なる印象が立ち上がる余白を探っている。",
      en: "Rather than focusing only on visible form, this work centers on the sensation that form can evoke. Through generation and processing, the image changes while leaving space for different impressions to arise from each viewer's memories and experiences."
    },
    {
      jaTitle: "#2340", enTitle: "#2340",
      ja: "デジタル上で生まれた形を繰り返し変化させ、元の像が持っていた意味を少しずつ離していく。説明できる対象から、感じ取るための存在へ。イメージが抽象へ移っていく過程そのものを作品としている。",
      en: "A digitally generated form is repeatedly transformed until it gradually moves away from its original meaning. The image shifts from an identifiable subject toward something to be sensed, making the process of becoming abstract part of the work itself."
    },
    {
      jaTitle: "#2339", enTitle: "#2339",
      ja: "生成されたイメージに手を加えながら、意図と偶然が同居する状態を残した。完成形を最初から決めるのではなく、変化の中で現れた感覚を拾い上げることで、制作そのものを探索の過程として捉えている。",
      en: "By working into a generated image, this piece preserves a state in which intention and chance coexist. Instead of deciding the final form in advance, it gathers sensations discovered through change and treats the act of making as a process of exploration."
    },
    {
      jaTitle: "#23,000,08", enTitle: "#23,000,08",
      ja: "現実の一瞬を切り取った写真に加工を加え、記録としての写真から、記憶に近い像へと変化させた。写っている事実よりも、その場から何を感じ取り、何が後に残るのかを見つめている。",
      en: "A photographed moment from reality is processed and shifted from a record toward an image closer to memory. The work is less concerned with the factual content of the photograph than with what is felt in that moment and what remains afterward."
    },
    {
      jaTitle: "#23,000,07", enTitle: "#23,000,07",
      ja: "写真が持つ現実性に加工を重ねることで、見たものと覚えているものの差を探った。記憶は時間とともに形を変える。その曖昧さを否定せず、ひとつの表現として残している。",
      en: "By processing the reality carried by a photograph, this work explores the difference between what was seen and what is remembered. Memory changes with time, and the piece accepts that uncertainty as part of its expression."
    },
    {
      jaTitle: "#23,000,06", enTitle: "#23,000,06",
      ja: "目の前にある風景をそのまま保存するのではなく、感じた印象を残すために写真へ加工を加えた。現実と記憶の間に生まれるわずかなずれを、視覚の揺らぎとして捉えている。",
      en: "Rather than preserving the scene exactly as it appeared, the photograph is processed to retain the impression it created. The work considers the slight gap between reality and memory as a form of visual fluctuation."
    },
    {
      jaTitle: "#2338", enTitle: "#2338",
      ja: "生成AIから現れた像を素材として捉え、加工によって自分の感覚へ引き寄せた。人が想像したものと機械が生成したものが重なるとき、そこに生まれる予測できない形を表現の可能性として残している。",
      en: "A generated image is treated as raw material and brought closer to the artist's perception through processing. Where human imagination and machine generation overlap, unpredictable forms appear; this work preserves that uncertainty as a possibility for expression."
    },
    {
      jaTitle: "#2337", enTitle: "#2337",
      ja: "完成を目指して形を整えるのではなく、変化の途中で生まれる違和感を残すことを意識した。生成と加工の反復によって、意味が定まる直前の曖昧な状態を視覚化している。",
      en: "Instead of refining the image toward a conventional sense of completion, this work keeps the discomfort that appears during change. Through repeated generation and processing, it visualizes an ambiguous state just before meaning becomes fixed."
    },
    {
      jaTitle: "#23,000,05", enTitle: "#23,000,05",
      ja: "写真に残るのは、その瞬間のすべてではなく一つの断片にすぎない。その断片へ加工を加えながら、記録と記憶の間にある距離を見つめ、現実を別の感覚へ変換している。",
      en: "A photograph preserves only a fragment of a moment, never the whole of it. By processing that fragment, this work examines the distance between record and memory and transforms reality into another kind of sensation."
    },
    {
      jaTitle: "#23,000,04", enTitle: "#23,000,04",
      ja: "日常の中で見過ごされる一瞬を写真として取り出し、加工によって時間の感覚を変化させた。何気ない光景も、見方が変われば別の記憶になる。その変化を静かに残した作品。",
      en: "A fleeting moment that might otherwise pass unnoticed is taken from everyday life and altered through processing. An ordinary scene can become a different memory when the way we see it changes; this work quietly preserves that transformation."
    },
    {
      jaTitle: "#23,000,03", enTitle: "#23,000,03",
      ja: "現実を写す写真に、作者の感覚を重ねるための加工を施した。目に見えたものを正確に伝えることよりも、その場で受け取った空気や余韻を、別のかたちで残すことを試みている。",
      en: "Processing is applied to a photograph of reality in order to layer the artist's perception onto it. Rather than communicating exactly what was visible, the work attempts to preserve the atmosphere and lingering impression of the moment in another form."
    },
    {
      jaTitle: "#2336", enTitle: "#2336",
      ja: "生成された像をそのまま完成とせず、加工を通して意味を少しずつ解体した。具体と抽象の間を行き来しながら、見る人が自分自身の感覚を重ねられる余白をつくっている。",
      en: "The generated image is not treated as finished; processing gradually breaks apart its original meaning. Moving between the concrete and the abstract, the work creates room for viewers to layer their own perceptions onto the image."
    },
    {
      jaTitle: "#2334", enTitle: "#2334",
      ja: "視覚情報を増やすのではなく、何を残し何を曖昧にするかを考えながら加工した。見えるものを減らすことで、かえって想像が広がる。その逆転した関係を探るデジタル作品。",
      en: "Rather than adding more visual information, the work is processed by considering what should remain and what should become ambiguous. By reducing what can be clearly seen, imagination can expand; the piece explores that reversed relationship."
    },
    {
      jaTitle: "#2326", enTitle: "#2326",
      ja: "生成AIと加工を用いながら、頭の中にある明確ではないイメージへ近づくことを試みた。技術に答えを求めるのではなく、そこから生まれた偶然を選び直すことで、自分の感覚を探している。",
      en: "Using generative AI and processing, this work attempts to approach an image that exists only vaguely in the mind. Rather than asking technology for an answer, it searches for personal perception by repeatedly selecting from the accidents that emerge."
    },
    {
      jaTitle: "#23,000,02", enTitle: "#23,000,02",
      ja: "写真を記録ではなく、感覚を保存するための素材として扱った。加工によって現実との距離を少しずつ変化させ、目で見た景色が心の中で別の像へ変わっていく過程を表している。",
      en: "Photography is treated not simply as a record but as material for preserving sensation. Processing gradually changes its distance from reality, expressing how a scene seen with the eyes can become a different image within the mind."
    },
    {
      jaTitle: "#23,000,01", enTitle: "#23,000,01",
      ja: "現実の断片を写真として残し、そこへ加工を重ねることで、見ることと記憶することの違いを探ったシリーズの一作。日常にある像を、個人的な感覚へ引き寄せている。",
      en: "Part of a series that keeps fragments of reality as photographs and then processes them to explore the difference between seeing and remembering. An everyday image is gradually drawn closer to a more personal field of perception."
    },
    {
      jaTitle: "#2319", enTitle: "#2319",
      ja: "生成されたイメージを素材として、選択と加工を繰り返した。偶然に現れる形を排除せず、自分の意図と共存させることで、制作の中にある予測不能な部分を積極的に受け入れている。",
      en: "A generated image becomes material for repeated selection and processing. Rather than removing accidental forms, the work allows them to coexist with the artist's intention, actively accepting the unpredictable part of the creative process."
    },
    {
      jaTitle: "映し神", enTitle: "Utsushigami",
      ja: "人は目の前のものを見ているようで、そこに自分自身の記憶や感情を映している。自然や存在に宿る気配を特定の信仰として描くのではなく、見る人の内側から立ち上がる感覚として捉えた作品。見つめる対象と、見つめる自分との境界を問いかけている。",
      en: "We may believe we are simply looking at something before us, yet our own memories and emotions are reflected there. Rather than depicting a specific religious belief, this work considers the presence felt in nature and existence as a sensation arising from within the viewer, questioning the boundary between what is seen and the person who sees it."
    },
    {
      jaTitle: "#2203", enTitle: "#2203",
      ja: "絵具を重ねる行為の中で、色や形が予想とは異なる方向へ変化していく過程を受け入れた。完成図に合わせるのではなく、描きながら現れる感覚を選び取り、画面との対話を重ねて制作している。",
      en: "Through the act of layering paint, colors and forms sometimes move in directions different from what was expected. Rather than forcing the work toward a predetermined image, this piece develops through repeated choices and a continuing dialogue with the surface."
    },
    {
      jaTitle: "#2202", enTitle: "#2202",
      ja: "形を説明するためではなく、内側にある感覚を外へ置くために描いた。絵具の重なりや制作の痕跡を残しながら、言葉になる前の感情やイメージをひとつの画面に留めている。",
      en: "This work was painted not to explain a form but to place an inner sensation outside the self. By retaining layers of paint and traces of the process, it keeps emotions and images on the surface before they become words."
    },
    {
      jaTitle: "#2201", enTitle: "#2201",
      ja: "物理的な質量を持たないデジタル作品であっても、人の感覚や記憶に何かを残すことはできるのか。生成と加工を通して、画面の中に存在する像と、見る側に生まれる反応の関係を探った。",
      en: "Can a digital work without physical mass still leave something in a person's perception or memory? Through generation and processing, this piece explores the relationship between an image existing on a screen and the response that arises within the viewer."
    },
    {
      jaTitle: "挑戦", enTitle: "Chōsen / Chousen",
      ja: "前へ進むことは、迷いや不安が消えることではない。それらを抱えたまま、それでも一歩を選ぶこと。本作は、自分の内側にあるためらいと向き合いながら、変化へ踏み出そうとする意志を抽象的に捉えている。",
      en: "Moving forward does not mean that hesitation or fear disappears. It means choosing another step while still carrying them. This work considers the will to move toward change while facing the uncertainty that remains within."
    },
    {
      jaTitle: "#2110", enTitle: "#2110",
      ja: "映像と加工を通して、静止した一枚では捉えきれない時間の変化を扱った。形が移り、印象が変わり続けることで、作品を見るという行為そのものが一つの時間体験になることを試みている。",
      en: "Through moving image and processing, this work deals with changes over time that cannot be fully contained in a single still image. As form and impression continue to shift, the act of viewing itself becomes a temporal experience."
    },
    {
      jaTitle: "広縁", enTitle: "Kōen",
      ja: "人や自然、出来事とのつながりは、目に見える関係だけで成り立っているわけではない。遠く離れていても残る記憶や感覚、偶然に重なる時間。そうした広がり続ける縁を、デジタルの変化する像として捉えた。",
      en: "Connections between people, nature, and events are not made only of visible relationships. Memories and sensations can remain across distance, while moments sometimes overlap by chance. This work considers such expanding ties through a changing digital image."
    },
    {
      jaTitle: "心境", enTitle: "Shinkyō",
      ja: "同じ景色を前にしても、心の状態によって見え方は変わる。外側の世界を描くのではなく、その世界を受け取る内側の変化に目を向けた作品。揺れ続ける心境を、固定されないイメージとして表している。",
      en: "Even before the same scene, what we perceive changes with our state of mind. Rather than depicting the outside world itself, this work turns toward the inner changes through which that world is received, expressing a shifting state of mind as an unfixed image."
    },
    {
      jaTitle: "#2109", enTitle: "#2109",
      ja: "写真、生成、加工という異なる工程を重ね、現実から少しずつ距離を取った像をつくった。元になった風景や対象の記録性を残しながら、そこへ想像を重ねることで、新しい見え方へ変換している。",
      en: "Photography, generation, and processing are layered to create an image that gradually moves away from direct reality. While retaining traces of its source, the work adds imagination and transforms the original record into a new way of seeing."
    },
    {
      jaTitle: "#2107", enTitle: "#2107",
      ja: "現実の写真を出発点に、生成と加工を重ねることで、実際に見たものと頭の中で再構成された像の間を探った。記録から想像へ移る境界を、デジタル表現として残している。",
      en: "Starting from a photograph of reality, generation and processing explore the space between what was actually seen and what is reconstructed in the mind. The work preserves the boundary where record begins to shift into imagination."
    },
    {
      jaTitle: "#2106", enTitle: "#2106",
      ja: "写真という現実の断片に生成AIの偶然性を重ね、さらに加工によって作者の感覚へ近づけた。異なる方法を組み合わせることで、一つの素材から複数の見え方が生まれる可能性を探っている。",
      en: "The chance of generative AI is layered onto a photographic fragment of reality and then processed toward the artist's own perception. By combining different methods, the work explores how a single source can produce multiple ways of seeing."
    },
    {
      jaTitle: "#2105", enTitle: "#2105",
      ja: "写真の中にある現実性を残しながら、生成と加工によって別の時間や場所を思わせる像へ変化させた。目の前にあったものと、そこから広がる想像の間を行き来する作品。",
      en: "While retaining the reality contained in a photograph, generation and processing transform it into an image that may suggest another time or place. The work moves between what stood before the camera and the imagination that expands from it."
    },
    {
      jaTitle: "#2104", enTitle: "#2104",
      ja: "現実を写した写真に手を加えることで、見慣れたものが別の存在へ変わる瞬間を探った。加工や生成による変化を重ねながら、日常の中に潜む未知の感覚を引き出している。",
      en: "By working into a photograph of reality, this piece explores the moment when something familiar begins to feel like another presence. Through layers of processing and generation, it draws out an unfamiliar sensation hidden within the everyday."
    },
    {
      jaTitle: "#2103", enTitle: "#2103",
      ja: "写真を起点に、生成と加工を通して像を変化させた。現実をそのまま再現することから離れ、作者がその場で受け取った感覚と、後から生まれた想像をひとつの画面に重ねている。",
      en: "Beginning with photography, the image is transformed through generation and processing. Moving away from direct reproduction, the work layers the artist's immediate perception of a moment with imagination that emerged later."
    },
    {
      jaTitle: "#2102", enTitle: "#2102",
      ja: "現実の像と生成された像を重ねながら、どちらとも言い切れない中間の状態をつくった。写真が持つ記録性と、生成表現の非現実性を行き来しながら、見るという行為の曖昧さを探っている。",
      en: "By layering an image of reality with a generated image, this work creates an in-between state that belongs fully to neither. Moving between the documentary quality of photography and the unreality of generation, it explores the ambiguity of seeing."
    },
    {
      jaTitle: "#2101", enTitle: "#2101",
      ja: "写真、生成AI、加工を組み合わせた初期の試みの一つ。異なる技術を使うこと自体を目的とせず、それぞれを重ねることで、自分の中にあるイメージをどこまで外側へ取り出せるかを探った。",
      en: "One of the early experiments combining photography, generative AI, and processing. The purpose is not simply to use different technologies, but to explore how layering them can bring an internal image outward into visible form."
    },
    {
      jaTitle: "戦争", enTitle: "Sensō",
      ja: "戦争という言葉が持つ重さを、出来事の説明ではなく、人の内側に残る恐怖、怒り、分断、喪失といった感覚から捉えた。明確な答えを示すのではなく、対立によって失われるものと、それを見つめる自分自身の距離を問いかける作品。",
      en: "Rather than explaining war as an event, this work approaches the weight of the word through sensations such as fear, anger, division, and loss that remain within people. It offers no simple answer, instead questioning what is lost through conflict and our own distance from it."
    },
    {
      jaTitle: "幸緑", enTitle: "Konryoku",
      ja: "緑から受け取る安らぎや生命の気配を、幸福という感覚と重ねて描いた。幸福を一つの形に決めるのではなく、自然に触れたときにふと訪れる静かな充足として捉えている。色が人の内側に呼び起こす感覚を見つめた作品。",
      en: "The calm and sense of life associated with green are layered with the feeling of happiness. Rather than defining happiness as a single form, this work considers it as a quiet sense of fulfillment that can arise when encountering nature, focusing on what color awakens within us."
    },
    {
      jaTitle: "#2100", enTitle: "#2100",
      ja: "絵具を通して、頭の中にある感覚を直接画面へ置くことを試みた。形の意味を先に決めるのではなく、色や痕跡が生まれるたびに次の動きを選び、制作の過程そのものを作品として残している。",
      en: "Through paint, this work attempts to place an inner sensation directly onto the surface. Instead of deciding the meaning of form in advance, each new color and trace leads to the next choice, leaving the creative process itself visible within the work."
    },
    {
      jaTitle: "#1504", enTitle: "#1504",
      ja: "高校時代の制作。完成された表現を求めるよりも、色や形を動かしながら、自分が何に反応し、何を残したいのかを探っていた時期の作品。現在へ続く、感覚を起点に制作する姿勢の初期の痕跡が残っている。",
      en: "Created during high school, this work comes from a period of searching rather than pursuing a fully established style. By moving color and form, the artist explored what drew a response and what should remain, revealing an early trace of the perception-led practice that continues today."
    },
    {
      jaTitle: "#1503", enTitle: "#1503",
      ja: "高校時代、自分の内側に浮かぶイメージをどのように画面へ移せるかを試していた時期の作品。技法を整えること以上に、描くことで初めて見えてくる感覚を大切にし、試行錯誤の痕跡を残している。",
      en: "Made during high school, this work belongs to a period of experimenting with how internal images could be transferred onto a surface. More than refining technique, it values sensations that became visible only through the act of making and retains traces of that trial and error."
    }
  ];

  const byTitle = new Map();
  captions.forEach(item => {
    byTitle.set(item.jaTitle, item);
    byTitle.set(item.enTitle, item);
  });

  function applyCaption() {
    const titleEl = modalBox.querySelector(".works h2");
    const captionEl = modalBox.querySelector(".modal-text p");
    if (!titleEl || !captionEl) return;

    const item = byTitle.get(titleEl.textContent.trim());
    if (!item) return;

    const lang = document.documentElement.lang === "en" ? "en" : "ja";
    const nextCaption = item[lang];
    if (captionEl.innerHTML !== nextCaption) {
      captionEl.innerHTML = nextCaption;
    }
  }

  const observer = new MutationObserver(applyCaption);
  observer.observe(modalBox, { childList: true, subtree: true });

  document.addEventListener("change", event => {
    if (event.target && event.target.matches('input[name="lang"]')) {
      requestAnimationFrame(applyCaption);
    }
  });

  applyCaption();
});
