const COLORS = {
  theme: 'rgba(16, 164, 254, 1)',
  grey: '#CECECE',
  disable: 'rgba(201, 201, 201, 1)',
  textGrey: '#9a9a9a',
  skyblue: 'rgba(139, 205, 254, 1)'
}

const ORDER_CATEGORY = [
  {
    title: '未完成',
    type: 0
  },
  {
    title: '已拒绝',
    type: 1
  },
  {
    title: '已完成',
    type: 97
  }
]

const HANDLES = {
  viewOrder: 'VIEW',
  exchangeAgain: 'EXCHANGE',
  contactCustomer: 'CUSTOMER',
  confirm: 'CONFIRM'
}

const SHARE_INFO = {
  desc: '分享身边每个人',
  img: 'https://lfxdev.res.inxi.net/file/20210128/16118258065170.jpg?imageView2/1/w/100/h/100/q/75|imageslim'
}

const IMAGE_PATH = '@/assets/imgs/'
const LOCAL_IMAGE = {
  empty: 'empty.png',
  phone: 'phone.png'
}

for (const key in LOCAL_IMAGE) {
  LOCAL_IMAGE[key] = IMAGE_PATH + LOCAL_IMAGE[key]
}

export { COLORS, LOCAL_IMAGE, HANDLES, SHARE_INFO, ORDER_CATEGORY }
