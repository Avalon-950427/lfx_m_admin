import GFuncs from './GFuncs'
import '@vant/touch-emulator'
import {
  Dialog,
  Notify,
  Toast,
  Form,
  Button,
  Image,
  Field,
  Cell,
  CellGroup,
  Radio,
  RadioGroup,
  Checkbox,
  CheckboxGroup,
  Switch,
  SwitchCell,
  Stepper,
  Rate,
  Slider,
  Picker,
  Popup,
  DatetimePicker,
  Area,
  Calendar,
  Tab,
  Tabs,
  Grid,
  GridItem,
  List,
  PullRefresh,
  Empty,
  SwipeCell,
  Search,
  DropdownMenu,
  DropdownItem,
  Sticky,
  Icon,
  Loading,
  Lazyload,
  NoticeBar,
  Skeleton,
  IndexBar,
  IndexAnchor,
  Collapse,
  CollapseItem,
  Overlay,
  NumberKeyboard,
  Col,
  Row,
  Tag,
  ImagePreview,
  Progress,
  Uploader,
  TreeSelect,
  ShareSheet,
  Divider
} from 'vant'

export default {
  install(Vue) {
    // 全局第三方组件(为了能自定义，故不能在main中全局引入vant及样式，需要这里局部引用)
    Vue.use(Dialog)
      .use(Notify)
      .use(Toast)
    Vue.use(Form)
    Vue.use(Button)
    Vue.use(Image)
    Vue.use(Field)
    Vue.use(Cell)
    Vue.use(CellGroup)
    Vue.use(Radio)
    Vue.use(RadioGroup)
    Vue.use(Checkbox)
    Vue.use(CheckboxGroup)
    Vue.use(Switch)
    Vue.use(SwitchCell)
    Vue.use(Stepper)
    Vue.use(Rate)
    Vue.use(Slider)
    Vue.use(Picker)
    Vue.use(Popup)
    Vue.use(DatetimePicker)
    Vue.use(Area)
    Vue.use(Calendar)

    Vue.use(Tab)
    Vue.use(Tabs)
    Vue.use(Grid)
    Vue.use(GridItem)

    Vue.use(List)
    Vue.use(PullRefresh)
    Vue.use(Empty)
    Vue.use(SwipeCell)
    Vue.use(Search)

    Vue.use(DropdownMenu)
    Vue.use(DropdownItem)
    Vue.use(Sticky)

    Vue.use(Icon)
    Vue.use(Loading)
    Vue.use(Lazyload)
    Vue.use(NoticeBar)
    Vue.use(Skeleton)
    Vue.use(IndexBar)
    Vue.use(IndexAnchor)
    Vue.use(Collapse)
    Vue.use(CollapseItem)
    Vue.use(Overlay)
    Vue.use(NumberKeyboard)
    Vue.use(Col)
    Vue.use(Row)
    Vue.use(Tag)
    Vue.use(ImagePreview)
    Vue.use(Progress)
    Vue.use(Uploader)
    Vue.use(TreeSelect)
    Vue.use(ShareSheet)
    Vue.use(Divider)
    // 全局自定义组件
    const files = require.context('./', false, /\.vue$/)
    Vue.prototype.$registerGComps(files)
    // 全局自定义函数
    Vue.prototype.$registerGFuncs(GFuncs)
  }
}
