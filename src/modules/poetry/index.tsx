import React, { useState, useEffect, useRef } from 'react';
import { PageType } from '../../types';
import { FadeIn, Bounce, Star, LessonCode, RuntimeBadge } from '../../components/animations';
import '../../App.css';

// ========== 诗词大赛数据 ==========
interface Poetry {
  id: number
  category: string
  categoryType: '节气' | '节日'
  title: string
  author: string
  lines: string[]  // 每句诗
}

// 24节气 + 传统节日诗词库
const POETRY_DB: Poetry[] = [
  // ===== 春季节气 =====
  { id: 1, category: '立春', categoryType: '节气', title: '立春偶成', author: '张栻', lines: ['律回岁晚冰霜少', '春到人间草木知', '便觉眼前生意满', '东风吹水绿参差'] },
  { id: 2, category: '立春', categoryType: '节气', title: '咏柳', author: '贺知章', lines: ['碧玉妆成一树高', '万条垂下绿丝绦', '不知细叶谁裁出', '二月春风似剪刀'] },
  { id: 3, category: '雨水', categoryType: '节气', title: '春夜喜雨', author: '杜甫', lines: ['好雨知时节', '当春乃发生', '随风潜入夜', '润物细无声'] },
  { id: 4, category: '雨水', categoryType: '节气', title: '绝句', author: '杜甫', lines: ['迟日江山丽', '春风花草香', '泥融飞燕子', '沙暖睡鸳鸯'] },
  { id: 5, category: '惊蛰', categoryType: '节气', title: '观田家', author: '韦应物', lines: ['微雨众卉新', '一雷惊蛰始', '田家几日闲', '耕种从此起'] },
  { id: 6, category: '惊蛰', categoryType: '节气', title: '新雷', author: '张维屏', lines: ['造物无言却有情', '每于寒尽觉春生', '千红万紫安排著', '只待新雷第一声'] },
  { id: 7, category: '春分', categoryType: '节气', title: '春分日', author: '徐铉', lines: ['仲春初四日', '春色正中分', '绿野徘徊月', '晴天断续云'] },
  { id: 8, category: '春分', categoryType: '节气', title: '村居', author: '高鼎', lines: ['草长莺飞二月天', '拂堤杨柳醉春烟', '儿童散学归来早', '忙趁东风放纸鸢'] },
  { id: 9, category: '清明', categoryType: '节气', title: '清明', author: '杜牧', lines: ['清明时节雨纷纷', '路上行人欲断魂', '借问酒家何处有', '牧童遥指杏花村'] },
  { id: 10, category: '清明', categoryType: '节气', title: '寒食', author: '韩翃', lines: ['春城无处不飞花', '寒食东风御柳斜', '日暮汉宫传蜡烛', '轻烟散入五侯家'] },
  { id: 11, category: '谷雨', categoryType: '节气', title: '晚春', author: '韩愈', lines: ['草树知春不久归', '百般红紫斗芳菲', '杨花榆荚无才思', '惟解漫天作雪飞'] },
  { id: 12, category: '谷雨', categoryType: '节气', title: '送春', author: '王令', lines: ['三月残花落更开', '小檐日日燕飞来', '子规夜半犹啼血', '不信东风唤不回'] },
  // ===== 夏季节气 =====
  { id: 13, category: '立夏', categoryType: '节气', title: '立夏', author: '陆游', lines: ['赤帜插城扉', '东君整驾归', '泥新巢燕闹', '花尽蜜蜂稀'] },
  { id: 14, category: '立夏', categoryType: '节气', title: '池上', author: '白居易', lines: ['小娃撑小艇', '偷采白莲回', '不解藏踪迹', '浮萍一道开'] },
  { id: 15, category: '小满', categoryType: '节气', title: '五绝·小满', author: '欧阳修', lines: ['夜莺啼绿柳', '皓月醒长空', '最爱垄头麦', '迎风笑落红'] },
  { id: 16, category: '小满', categoryType: '节气', title: '归田园四时乐', author: '欧阳修', lines: ['南风原头吹百草', '草木丛深茅舍小', '麦穗初齐稚子娇', '桑叶正肥蚕食饱'] },
  { id: 17, category: '芒种', categoryType: '节气', title: '时雨', author: '陆游', lines: ['时雨及芒种', '四野皆插秧', '家家麦饭美', '处处菱歌长'] },
  { id: 18, category: '芒种', categoryType: '节气', title: '芒种', author: '窦常', lines: ['愿见纤纤擢素手', '拾穗不违农时忙'] },
  { id: 19, category: '夏至', categoryType: '节气', title: '晓出净慈寺送林子方', author: '杨万里', lines: ['毕竟西湖六月中', '风光不与四时同', '接天莲叶无穷碧', '映日荷花别样红'] },
  { id: 20, category: '夏至', categoryType: '节气', title: '夏至', author: '范成大', lines: ['李核垂腰祝饐', '粽丝系臂扶羸', '节物竞随乡俗', '老翁闲伴儿嬉'] },
  { id: 21, category: '小暑', categoryType: '节气', title: '小暑', author: '陆游', lines: ['万瓦鳞鳞若火龙', '日车不动汗珠融', '无因羽翮氛埃外', '坐觉蒸炊釜甑中'] },
  { id: 22, category: '小暑', categoryType: '节气', title: '夏日南亭怀辛大', author: '孟浩然', lines: ['山光忽西落', '池月渐东上', '散发乘夕凉', '开轩卧闲敞'] },
  { id: 23, category: '大暑', categoryType: '节气', title: '大暑', author: '曾几', lines: ['赤日几时过', '清风无处寻', '经书聊枕籍', '瓜李漫浮沉'] },
  { id: 24, category: '大暑', categoryType: '节气', title: '纳凉', author: '秦观', lines: ['携扙来追柳外凉', '画桥南畔倚胡床', '月明船笛参差起', '风定池莲自在香'] },
  // ===== 秋季节气 =====
  { id: 25, category: '立秋', categoryType: '节气', title: '立秋', author: '刘翰', lines: ['睡起秋声无觅处', '满阶梧叶月明中'] },
  { id: 26, category: '立秋', categoryType: '节气', title: '山居秋暝', author: '王维', lines: ['空山新雨后', '天气晚来秋', '明月松间照', '清泉石上流'] },
  { id: 27, category: '处暑', categoryType: '节气', title: '处暑', author: '苏泂', lines: ['处暑无三日', '新凉直万金', '白头更世事', '青草印禅心'] },
  { id: 28, category: '处暑', categoryType: '节气', title: '早秋', author: '许浑', lines: ['遥夜泛清瑟', '西风生翠萝', '残萤栖玉露', '早雁拂金河'] },
  { id: 29, category: '白露', categoryType: '节气', title: '月夜忆舍弟', author: '杜甫', lines: ['戍鼓断人行', '边秋一雁声', '露从今夜白', '月是故乡明'] },
  { id: 30, category: '白露', categoryType: '节气', title: '秋词', author: '刘禹锡', lines: ['自古逢秋悲寂寥', '我言秋日胜春朝', '晴空一鹤排云上', '便引诗情到碧霄'] },
  { id: 31, category: '秋分', categoryType: '节气', title: '天净沙·秋思', author: '马致远', lines: ['枯藤老树昏鸦', '小桥流水人家', '古道西风瘦马', '夕阳西下'] },
  { id: 32, category: '秋分', categoryType: '节气', title: '秋夕', author: '杜牧', lines: ['银烛秋光冷画屏', '轻罗小扇扑流萤', '天阶夜色凉如水', '坐看牵牛织女星'] },
  { id: 33, category: '寒露', categoryType: '节气', title: '寒露', author: '白居易', lines: ['袅袅凉风动', '凄凄寒露零', '兰衰花始白', '荷破叶犹青'] },
  { id: 34, category: '寒露', categoryType: '节气', title: '九月九日忆山东兄弟', author: '王维', lines: ['独在异乡为异客', '每逢佳节倍思亲', '遥知兄弟登高处', '遍插茱萸少一人'] },
  { id: 35, category: '霜降', categoryType: '节气', title: '山行', author: '杜牧', lines: ['远上寒山石径斜', '白云生处有人家', '停车坐爱枫林晚', '霜叶红于二月花'] },
  { id: 36, category: '霜降', categoryType: '节气', title: '霜月', author: '李商隐', lines: ['初闻征雁已无蝉', '百尺楼高水接天', '青女素娥俱耐冷', '月中霜里斗婵娟'] },
  // ===== 冬季节气 =====
  { id: 37, category: '立冬', categoryType: '节气', title: '立冬', author: '李白', lines: ['冻笔新诗懒写', '寒炉美酒时温', '醉看墨花月白', '恍疑雪满前村'] },
  { id: 38, category: '立冬', categoryType: '节气', title: '江雪', author: '柳宗元', lines: ['千山鸟飞绝', '万径人踪灭', '孤舟蓑笠翁', '独钓寒江雪'] },
  { id: 39, category: '小雪', categoryType: '节气', title: '小雪', author: '戴叔伦', lines: ['花雪随风不厌看', '更多还肯失林峦', '愁人正在书窗下', '一片飞来一片寒'] },
  { id: 40, category: '小雪', categoryType: '节气', title: '夜雪', author: '白居易', lines: ['已讶衾枕冷', '复见窗户明', '夜深知雪重', '时闻折竹声'] },
  { id: 41, category: '大雪', categoryType: '节气', title: '大雪', author: '陆游', lines: ['大雪江南见未曾', '今年方始是严凝', '巧穿帘罅如相觅', '重压林梢欲不胜'] },
  { id: 42, category: '大雪', categoryType: '节气', title: '白雪歌送武判官归京', author: '岑参', lines: ['北风卷地白草折', '胡天八月即飞雪', '忽如一夜春风来', '千树万树梨花开'] },
  { id: 43, category: '冬至', categoryType: '节气', title: '冬至', author: '杜甫', lines: ['天时人事日相催', '冬至阳生春又来', '刺绣五纹添弱线', '吹葭六琯动浮灰'] },
  { id: 44, category: '冬至', categoryType: '节气', title: '邯郸冬至夜思家', author: '白居易', lines: ['邯郸驿里逢冬至', '抱膝灯前影伴身', '想得家中夜深坐', '还应说着远行人'] },
  { id: 45, category: '小寒', categoryType: '节气', title: '小寒', author: '陆游', lines: ['小寒已近手难舒', '终日掩门深闭庐', '树欲生寒叶将落', '梅如解语亦情疏'] },
  { id: 46, category: '小寒', categoryType: '节气', title: '梅花', author: '王安石', lines: ['墙角数枝梅', '凌寒独自开', '遥知不是雪', '为有暗香来'] },
  { id: 47, category: '大寒', categoryType: '节气', title: '大寒', author: '陆游', lines: ['大寒雪未消', '闭户不能出', '可怜切云冠', '局此容膝室'] },
  { id: 48, category: '大寒', categoryType: '节气', title: '卖炭翁', author: '白居易', lines: ['满面尘灰烟火色', '两鬓苍苍十指黑', '卖炭得钱何所营', '身上衣裳口中食'] },
  // ===== 传统节日 =====
  { id: 49, category: '春节', categoryType: '节日', title: '元日', author: '王安石', lines: ['爆竹声中一岁除', '春风送暖入屠苏', '千门万户曈曈日', '总把新桃换旧符'] },
  { id: 50, category: '春节', categoryType: '节日', title: '拜年', author: '文徵明', lines: ['不求见面惟通谒', '名纸朝来满敝庐', '我亦随人投数纸', '世情嫌简不嫌虚'] },
  { id: 51, category: '春节', categoryType: '节日', title: '守岁', author: '苏轼', lines: ['欲知垂尽岁', '有似赴壑蛇', '儿童强不睡', '相守夜欢哗'] },
  { id: 52, category: '春节', categoryType: '节日', title: '新年作', author: '刘长卿', lines: ['乡心新岁切', '天畔独潸然', '老至居人下', '春归在客先'] },
  { id: 53, category: '春节', categoryType: '节日', title: '屠苏酒', author: '陆游', lines: ['半盏屠苏犹未举', '灯前小草写桃符'] },
  { id: 54, category: '春节', categoryType: '节日', title: '迎春', author: '叶燮', lines: ['律转鸿钧', '新元肇启', '东风解冻', '淑气光临'] },
  { id: 55, category: '元宵节', categoryType: '节日', title: '元夕', author: '辛弃疾', lines: ['东风夜放花千树', '更吹落星如雨', '宝马雕车香满路', '凤箫声动'] },
  { id: 56, category: '元宵节', categoryType: '节日', title: '十五夜观灯', author: '卢照邻', lines: ['锦里开芳宴', '兰缸艳早年', '缛彩遥分地', '繁光远缀天'] },
  { id: 57, category: '元宵节', categoryType: '节日', title: '上元夜', author: '崔液', lines: ['玉漏银壶且莫催', '铁关金锁彻明开', '谁家见月能闲坐', '何处闻灯不看来'] },
  { id: 58, category: '元宵节', categoryType: '节日', title: '正月十五夜', author: '苏味道', lines: ['火树银花合', '星桥铁锁开', '暗尘随马去', '明月逐人来'] },
  { id: 59, category: '元宵节', categoryType: '节日', title: '元宵', author: '唐寅', lines: ['有灯无月不娱人', '有月无灯不算春', '春到人间人似玉', '灯烧月下月如银'] },
  { id: 60, category: '寒食节', categoryType: '节日', title: '寒食', author: '韩翃', lines: ['春城无处不飞花', '寒食东风御柳斜', '日暮汉宫传蜡烛', '轻烟散入五侯家'] },
  { id: 61, category: '寒食节', categoryType: '节日', title: '寒食寄京师诸弟', author: '韦应物', lines: ['雨中禁火空斋冷', '江上流莺独坐听', '把酒看花想诸弟', '杜陵寒食草青青'] },
  { id: 62, category: '寒食节', categoryType: '节日', title: '寒食日即事', author: '温庭筠', lines: ['清溪一道穿桃李', '演漾绿蒲涵白芷', '溪上人家凡几家', '落花半落东流水'] },
  { id: 63, category: '清明节', categoryType: '节日', title: '清明', author: '杜牧', lines: ['清明时节雨纷纷', '路上行人欲断魂', '借问酒家何处有', '牧童遥指杏花村'] },
  { id: 64, category: '清明节', categoryType: '节日', title: '清明', author: '王禹偁', lines: ['无花无酒过清明', '兴味萧然似野僧', '昨日邻家乞新火', '晓窗分与读书灯'] },
  { id: 65, category: '清明节', categoryType: '节日', title: '苏堤清明即事', author: '吴惟信', lines: ['梨花风起正清明', '游子寻春半出城', '日暮笙歌收拾去', '万株杨柳属流莺'] },
  { id: 66, category: '清明节', categoryType: '节日', title: '清明日', author: '温庭筠', lines: ['清娥画扇中', '春树郁金红', '出犯繁花露', '归穿弱柳风'] },
  { id: 67, category: '端午节', categoryType: '节日', title: '端午', author: '文秀', lines: ['节分端午自谁言', '万古传闻为屈原', '堪笑楚江空渺渺', '不能洗得直臣冤'] },
  { id: 68, category: '端午节', categoryType: '节日', title: '竞渡诗', author: '卢肇', lines: ['石溪久住思端午', '馆驿楼前看发机', '鼙鼓动时雷隐隐', '兽头凌处雪微微'] },
  { id: 69, category: '端午节', categoryType: '节日', title: '乙卯重五诗', author: '陆游', lines: ['重五山村好', '榴花忽已繁', '粽包分两髻', '艾束著危冠'] },
  { id: 70, category: '端午节', categoryType: '节日', title: '端午日', author: '殷尧藩', lines: ['少年佳节倍多情', '老去谁知感慨生', '不效艾符趋习俗', '但祈蒲酒话升平'] },
  { id: 71, category: '七夕节', categoryType: '节日', title: '乞巧', author: '林杰', lines: ['七夕今宵看碧霄', '牵牛织女渡河桥', '家家乞巧望秋月', '穿尽红丝几万条'] },
  { id: 72, category: '七夕节', categoryType: '节日', title: '迢迢牵牛星', author: '佚名', lines: ['迢迢牵牛星', '皎皎河汉女', '纤纤擢素手', '札札弄机杼'] },
  { id: 73, category: '七夕节', categoryType: '节日', title: '七夕', author: '罗隐', lines: ['络角星河菡萏天', '一家欢笑设红筵', '应倾谢女珠玑箧', '尽写檀郎锦绣篇'] },
  { id: 74, category: '中秋节', categoryType: '节日', title: '十五夜望月', author: '王建', lines: ['中庭地白树栖鸦', '冷露无声湿桂花', '今夜月明人尽望', '不知秋思落谁家'] },
  { id: 75, category: '中秋节', categoryType: '节日', title: '水调歌头', author: '苏轼', lines: ['明月几时有', '把酒问青天', '不知天上宫阙', '今夕是何年'] },
  { id: 76, category: '中秋节', categoryType: '节日', title: '中秋月', author: '晏殊', lines: ['十轮霜影转庭梧', '此夕羁人独向隅', '未必素娥无怅恨', '玉蟾清冷桂花孤'] },
  { id: 77, category: '重阳节', categoryType: '节日', title: '九月九日忆山东兄弟', author: '王维', lines: ['独在异乡为异客', '每逢佳节倍思亲', '遥知兄弟登高处', '遍插茱萸少一人'] },
  { id: 78, category: '重阳节', categoryType: '节日', title: '醉花阴', author: '李清照', lines: ['薄雾浓云愁永昼', '瑞脑销金兽', '佳节又重阳', '玉枕纱厨'] },
  { id: 79, category: '除夕', categoryType: '节日', title: '除夜', author: '高适', lines: ['旅馆寒灯独不眠', '客心何事转凄然', '故乡今夜思千里', '霜鬓明朝又一年'] },
  { id: 80, category: '除夕', categoryType: '节日', title: '除夜雪', author: '陆游', lines: ['北风吹雪四更初', '嘉瑞天教及岁除', '半盏屠苏犹未举', '灯前小草写桃符'] },
]

// 题目类型
type QuizType = 'line_complete' | 'author' | 'category' | 'judge_line' | 'judge_author'

interface Quiz {
  id: number
  type: QuizType
  question: string
  options: string[]
  answer: number
  poetry: Poetry
  explanation?: string
}

// 生成随机题目
const generateQuiz = (poetry: Poetry, allPoetries: Poetry[]): Quiz => {
  const types: QuizType[] = ['line_complete', 'author', 'category', 'judge_line', 'judge_author']
  const type = types[Math.floor(Math.random() * types.length)]
  
  const wrongOptions = (correct: string) => {
    const filtered = allPoetries
      .filter(p => p[correct === 'author' ? 'author' : 'category'] !== (correct === 'author' ? poetry.author : poetry.category))
      .map(p => correct === 'author' ? p.author : p.category)
      .filter((v, i, a) => a.indexOf(v) === i) // 去重
    const shuffled = filtered.sort(() => Math.random() - 0.5)
    return shuffled.slice(0, 3)
  }

  switch (type) {
    case 'line_complete': {
      // 给出一句诗，选择下一句
      const lineIdx = Math.floor(Math.random() * (poetry.lines.length - 1))
      const questionLine = poetry.lines[lineIdx]
      const correctNext = poetry.lines[lineIdx + 1]
      const wrongs = allPoetries
        .filter(p => p.id !== poetry.id)
        .map(p => p.lines[Math.floor(Math.random() * p.lines.length)])
        .filter(l => l !== correctNext)
        .slice(0, 3)
      const options = [correctNext, ...wrongs].sort(() => Math.random() - 0.5)
      return {
        id: poetry.id * 100 + lineIdx,
        type,
        question: `上句：${questionLine}\n请接下句：`,
        options,
        answer: options.indexOf(correctNext),
        poetry,
        explanation: `这首诗出自《${poetry.title}》${poetry.category}时节`,
      }
    }
    case 'author': {
      // 给出诗句，选择作者
      const questionLine = poetry.lines[Math.floor(Math.random() * poetry.lines.length)]
      const correct = poetry.author
      const wrongs = wrongOptions('author')
      const options = [correct, ...wrongs].sort(() => Math.random() - 0.5)
      return {
        id: poetry.id * 100 + 50,
        type,
        question: `这句诗的作者是谁？\n"${questionLine}..."`,
        options,
        answer: options.indexOf(correct),
        poetry,
        explanation: `这句诗出自唐代诗人${poetry.author}的《${poetry.title}》`,
      }
    }
    case 'category': {
      // 给出诗句，选择节气/节日
      const questionLine = poetry.lines[Math.floor(Math.random() * poetry.lines.length)]
      const correct = poetry.category
      const allCategories = [...new Set(allPoetries.map(p => p.category))]
      const wrongs = allCategories.filter(c => c !== correct).sort(() => Math.random() - 0.5).slice(0, 3)
      const options = [correct, ...wrongs].sort(() => Math.random() - 0.5)
      return {
        id: poetry.id * 100 + 60,
        type,
        question: `这句诗描述的是哪个${poetry.categoryType}？\n"${questionLine}..."`,
        options,
        answer: options.indexOf(correct),
        poetry,
        explanation: `这首诗出自《${poetry.title}》，描述的是${poetry.category}${poetry.categoryType}`,
      }
    }
    case 'judge_line': {
      // 判断题：给出上句和下句选项，判断是否匹配
      const lineIdx = Math.floor(Math.random() * (poetry.lines.length - 1))
      const correctNext = poetry.lines[lineIdx + 1]
      const wrongs = allPoetries
        .filter(p => p.id !== poetry.id)
        .map(p => p.lines[Math.floor(Math.random() * p.lines.length)])
        .filter(l => l !== correctNext)[0] || '春风又绿江南岸'
      const isCorrect = Math.random() > 0.5
      const options = ['✅ 正确', '❌ 错误']
      return {
        id: poetry.id * 100 + lineIdx + 70,
        type,
        question: `判断："${poetry.lines[lineIdx]}，${isCorrect ? correctNext : wrongs}"\n这是否是《${poetry.title}》中的正确诗句？`,
        options,
        answer: isCorrect ? 0 : 1,
        poetry,
        explanation: isCorrect 
          ? `正确！这句诗出自${poetry.author}的《${poetry.title}》`
          : `错误！正确下句应该是"${correctNext}"`,
      }
    }
    case 'judge_author': {
      // 判断题：判断诗句是否属于某位诗人
      const questionLine = poetry.lines[Math.floor(Math.random() * poetry.lines.length)]
      const isCorrectAuthor = Math.random() > 0.5
      const displayAuthor = isCorrectAuthor ? poetry.author : 
        allPoetries.filter(p => p.author !== poetry.author)[Math.floor(Math.random() * (allPoetries.length - 1))]?.author || '李白'
      const options = ['✅ 正确', '❌ 错误']
      return {
        id: poetry.id * 100 + 80,
        type,
        question: `判断："${questionLine}..."\n这是否是诗人${displayAuthor}的作品？`,
        options,
        answer: isCorrectAuthor ? 0 : 1,
        poetry,
        explanation: isCorrectAuthor
          ? `正确！这句诗出自唐代诗人${poetry.author}的《${poetry.title}》`
          : `错误！这句诗实际出自${poetry.author}的《${poetry.title}》`,
      }
    }
  }
}

// 随机打乱并生成题目组
const generateQuizSet = (count: number = 10): Quiz[] => {
  const shuffled = [...POETRY_DB].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, Math.min(count, shuffled.length)).map(p => generateQuiz(p, POETRY_DB))
}

// 庆祝动画组件
const CelebrationEffect = ({ show }: { show: boolean }) => {
  if (!show) return null
  return (
    <div className="celebration-container">
      {[...Array(20)].map((_, i) => (
        <div 
          key={i} 
          className="confetti" 
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 0.5}s`,
            backgroundColor: ['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#ff6b9d'][i % 5],
          }}
        />
      ))}
    </div>
  )
}

// ========== 诗词大赛介绍页 ==========
export const PoetryIntroPage = ({ onNext, onBack }: { onNext: () => void, onBack: () => void }) => {
  const [step, setStep] = useState(0)
  
  return (
    <div className="page">
      <button className="back-btn" onClick={onBack}>← 返回目录</button>
      
      {step === 0 && (
        <>
          <FadeIn>
            <div className="poetry-hero">
              <div className="poetry-lantern">🏮</div>
              <h1 className="page-title poetry-title">
                诗词大赛
              </h1>
              <p className="poetry-subtitle">24节气 · 传统节日</p>
            </div>
          </FadeIn>
          
          <FadeIn delay={400}>
            <div className="poetry-intro-card">
              <h3>🌸 比赛规则</h3>
              <ul>
                <li>共 <strong>10 道题</strong>，随机抽取</li>
                <li>包含 <strong>选择题</strong> 和 <strong>判断题</strong></li>
                <li>涵盖 <strong>24节气</strong> 和 <strong>传统节日</strong> 诗词</li>
              </ul>
            </div>
          </FadeIn>
          
          <FadeIn delay={700}>
            <div className="poetry-categories">
              <div className="poetry-cat-item">
                <span className="cat-icon">🌱</span>
                <span>春季节气</span>
                <small>立春·雨水·惊蛰·春分·清明·谷雨</small>
              </div>
              <div className="poetry-cat-item">
                <span className="cat-icon">☀️</span>
                <span>夏季节气</span>
                <small>立夏·小满·芒种·夏至·小暑·大暑</small>
              </div>
              <div className="poetry-cat-item">
                <span className="cat-icon">🍂</span>
                <span>秋季节气</span>
                <small>立秋·处暑·白露·秋分·寒露·霜降</small>
              </div>
              <div className="poetry-cat-item">
                <span className="cat-icon">❄️</span>
                <span>冬季节气</span>
                <small>立冬·小雪·大雪·冬至·小寒·大寒</small>
              </div>
              <div className="poetry-cat-item">
                <span className="cat-icon">🎊</span>
                <span>传统节日</span>
                <small>春节·元宵·端午·七夕·中秋·重阳·除夕...</small>
              </div>
            </div>
          </FadeIn>
          
          <FadeIn delay={1000}>
            <button className="next-btn poetry-start-btn" onClick={() => setStep(1)}>
              🎯 准备好了！开始挑战
            </button>
          </FadeIn>
        </>
      )}
      
      {step === 1 && (
        <>
          <FadeIn>
            <h2 className="page-title">小提示</h2>
          </FadeIn>
          
          <FadeIn delay={300}>
            <div className="poetry-tips">
              <div className="tip-card">
                
                <div>
                  <strong>上句接下句</strong>
                  <p>给出诗句的前半句，选择正确的后半句</p>
                </div>
              </div>
              <div className="tip-card">
                
                <div>
                  <strong>作者是谁</strong>
                  <p>根据诗句内容，选择正确的诗人</p>
                </div>
              </div>
              <div className="tip-card">
                
                <div>
                  <strong>属于哪个节日</strong>
                  <p>判断诗句描述的是哪个节气或节日</p>
                </div>
              </div>
              <div className="tip-card">
                
                <div>
                  <strong>判断对错</strong>
                  <p>判断诗句或作者是否正确</p>
                </div>
              </div>
            </div>
          </FadeIn>
          
          <FadeIn delay={600}>
            <button className="next-btn" onClick={onNext}>
              🚀 出发！去答题
            </button>
          </FadeIn>
        </>
      )}
    </div>
  )
}

// ========== 诗词大赛答题页 ==========
export const PoetryQuizPage = ({ onFinish, onBack }: { onFinish: (score: number, total: number) => void, onBack: () => void }) => {
  const [quizzes] = useState(() => generateQuizSet(10))
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [showCorrect, setShowCorrect] = useState(false)
  
  const quiz = quizzes[current]
  const isCorrect = selected === quiz.answer
  
  const handleSubmit = () => {
    setSubmitted(true)
    setShowCorrect(true)
    if (selected === quiz.answer) {
      setScore(s => s + 1)
    }
  }
  
  const handleNext = () => {
    if (current < quizzes.length - 1) {
      setCurrent(c => c + 1)
      setSelected(null)
      setSubmitted(false)
      setShowCorrect(false)
    } else {
      onFinish(score + (selected === quiz.answer ? 1 : 0), quizzes.length)
    }
  }
  
  const getTypeLabel = (type: QuizType) => {
    switch (type) {
      case 'line_complete': return '📝 上句接下句'
      case 'author': return '👤 诗句作者'
      case 'category': return '🏷️ 节日归属'
      case 'judge_line': return '✅ 判断对错'
      case 'judge_author': return '✅ 判断作者'
    }
  }
  
  return (
    <div className="page poetry-quiz-page">
      <button className="back-btn" onClick={onBack}>← 退出比赛</button>
      
      <FadeIn>
        <div className="quiz-header">
          <div className="quiz-progress">
            <span className="quiz-num">第 {current + 1} 题</span>
            <span className="quiz-total">/ 共 {quizzes.length} 题</span>
          </div>
          <div className="quiz-score">⭐ {score} 分</div>
        </div>
        <div className="quiz-progress-bar">
          <div 
            className="quiz-progress-fill" 
            style={{ width: `${((current + 1) / quizzes.length) * 100}%` }}
          />
        </div>
      </FadeIn>
      
      <FadeIn delay={200}>
        <div className="quiz-type-badge">{getTypeLabel(quiz.type)}</div>
      </FadeIn>
      
      <FadeIn delay={300}>
        <div className="quiz-question-box">
          <p style={{ whiteSpace: 'pre-line' }}>{quiz.question}</p>
        </div>
      </FadeIn>
      
      <FadeIn delay={500}>
        <div className="quiz-options">
          {quiz.options.map((opt, i) => (
            <button
              key={i}
              className={`quiz-option ${selected === i ? 'selected' : ''} ${
                showCorrect && i === quiz.answer ? 'correct' : ''
              } ${
                showCorrect && selected === i && !isCorrect ? 'wrong' : ''
              }`}
              onClick={() => !submitted && setSelected(i)}
              disabled={submitted}
            >
              <span className="option-letter">{String.fromCharCode(65 + i)}</span>
              <span className="option-text">{opt}</span>
              {showCorrect && i === quiz.answer && <span className="option-icon">✓</span>}
              {showCorrect && selected === i && !isCorrect && <span className="option-icon">✗</span>}
            </button>
          ))}
        </div>
      </FadeIn>
      
      <FadeIn delay={700}>
        {!submitted ? (
          <button 
            className="submit-btn quiz-submit" 
            onClick={handleSubmit} 
            disabled={selected === null}
          >
            提交答案
          </button>
        ) : (
          <div className={`quiz-result ${isCorrect ? 'correct' : 'wrong'}`}>
            <CelebrationEffect show={isCorrect} />
            <div className="result-icon-large">
              {isCorrect ? '🎉' : '🤔'}
            </div>
            <p className="result-text">{isCorrect ? '太棒了！答对啦！' : '答错了，没关系~'}</p>
            {quiz.explanation && (
              <p className="result-explanation">{quiz.explanation}</p>
            )}
            <button className="next-btn" onClick={handleNext}>
              {current < quizzes.length - 1 ? '下一题 →' : '查看成绩 🏆'}
            </button>
          </div>
        )}
      </FadeIn>
    </div>
  )
}

// ========== 诗词大赛结果页 ==========
export const PoetryResultPage = ({ score, total, onRetry, onHome }: { 
  score: number, 
  total: number, 
  onRetry: () => void,
  onHome: () => void 
}) => {
  const percentage = Math.round((score / total) * 100)
  const grade = percentage >= 90 ? '🏆' : percentage >= 70 ? '🌟' : percentage >= 50 ? '👍' : '💪'
  const gradeText = percentage >= 90 ? '诗仙下凡！' : percentage >= 70 ? '诗词小达人！' : percentage >= 50 ? '继续加油！' : '再接再厉！'
  const gradeColor = percentage >= 90 ? '#ffd700' : percentage >= 70 ? '#6366f1' : percentage >= 50 ? '#10b981' : '#f59e0b'
  
  return (
    <div className="page poetry-result-page">
      <FadeIn>
        <div className="result-celebration">
          <div className="result-emoji">{grade}</div>
          <h2 className="page-title">比赛结束！</h2>
          <div className="result-score-display" style={{ color: gradeColor }}>
            {score} <span>/</span> {total}
          </div>
          <p className="result-percentage">{percentage}% 正确率</p>
          <p className="result-grade-text">{gradeText}</p>
        </div>
      </FadeIn>
      
      <FadeIn delay={400}>
        <div className="result-summary">
          <h3>📊 答题情况</h3>
          <div className="summary-stats">
            <div className="stat-item correct">
              <span className="stat-icon">✓</span>
              <span className="stat-num">{score}</span>
              <span className="stat-label">答对</span>
            </div>
            <div className="stat-item wrong">
              <span className="stat-icon">✗</span>
              <span className="stat-num">{total - score}</span>
              <span className="stat-label">答错</span>
            </div>
          </div>
        </div>
      </FadeIn>
      
      <FadeIn delay={700}>
        <div className="result-message">
          {percentage >= 90 && (
            <p>太厉害了！你对传统诗词了如指掌！</p>
          )}
          {percentage >= 70 && percentage < 90 && (
            <p>很棒！你对诗词有不错的了解~</p>
          )}
          {percentage >= 50 && percentage < 70 && (
            <p>不错的开始！多读读诗词会更厉害！</p>
          )}
          {percentage < 50 && (
            <p>没关系！诗词需要慢慢积累，再来挑战吧！</p>
          )}
        </div>
      </FadeIn>
      
      <FadeIn delay={1000}>
        <div className="result-actions">
          <button className="retry-btn" onClick={onRetry}>
            🔄 再来一局
          </button>
          <button className="restart-btn" onClick={onHome}>
            🏠 返回首页
          </button>
        </div>
      </FadeIn>
      
      <CelebrationEffect show={percentage >= 70} />
    </div>
  )
}
