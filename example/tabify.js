import Tabify from '../src'

const NormalTabify = Tabify.create({
  barItem: {
    styles: {
      container: {
        height: 44,
      },
      title: {
        color: '#9B9B9B',
        fontSize: 16,
        lineHeight: 20,
      },
      subTitle: {
        color: '#9B9B9B',
        lineHeight: 16,
        fontSize: 12,
        marginBottom: 6,
      },
      activeTitle: {
        color: '#111',
      },
      badge: {
        backgroundColor: '#FF6188',
        borderRadius: 8,
        height: 16,
        marginLeft: 4,
        minWidth: 16,
        paddingHorizontal: 3,
      },
      badgeTxt: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '200',
      },
    },
  },
  bar: {
    isShowIndicator: true,
  },
  barIndicator: {
    getWidth: layouts => layouts.map(d => d.content.width / 2),
    styles: {
      container: {
        backgroundColor: '#FF6188',
        borderRadius: 2,
        height: 3,
      },
    },
  },
})

const ScrollableTabify = Tabify.create({
  barItem: {
    styles: {
      container: {
        height: 49,
        paddingHorizontal: 12,
      },
      title: {
        color: '#111',
        fontSize: 16,
        lineHeight: 28,
      },
      activeTitle: {
        color: '#FF6188',
        fontSize: 24,
      },
    },
  },
  bar: {
    isScrollable: true,
  },
})

export {
  NormalTabify,
  ScrollableTabify,
}
