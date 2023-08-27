import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)


/* Router Modules */
/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/',
    component: () => import('@/components/HomePage'),
    redirect: '/home',
    meta: {
      title: 'Mess-首页'
    },
    hideInMenu: true,
    children: [
      {
        name:'home',
        path: '/home',
        component: () => import('@/pages/home'),
        meta: {
          title: 'Mess-首页'
        }
      },
      
      {
        name:'login',
        path: '/login',
        component: () => import('@/pages/login'),
        meta: {
          title: 'Mess-登录'
        }
      },
      {
        name:'register',
        path: '/register',
        component: () => import('@/pages/register'),
        meta: {
          title: 'Mess-注册'
        }
      },
      {
        name:'userinfo',
        path: '/userinfo',
        component: () => import('@/pages/userinfo'),
        meta: {
          title: 'Mess-用户信息'
        }
      },
      {
        name:'traninfo',
        path: '/traninfo',
        component: () => import('@/pages/traninfo'),
        meta: {
          title: 'Mess-交易信息中心'
        }
      },
      {
        name:'traninfodetail',
        path: '/traninfodetail',
        component: () => import('@/pages/traninfodetail'),
        meta: {
          title: 'Mess-交易信息详情'
        }
      },
      {
        name:'blacklist',
        path: '/blacklist',
        component: () => import('@/pages/blacklist'),
        meta: {
          title: 'Mess-交易黑名单'
        }
      },
      {
        name:'support',
        path: '/support',
        component: () => import('@/pages/support'),
        meta: {
          title: 'Mess-捐助支持'
        }
      },
      {
        name:'sysnotice',
        path: '/sysnotice',
        component: () => import('@/pages/sysnotice'),
        meta: {
          title: 'Mess-系统通知'
        }
      },
      {
        name:'comment',
        path: '/comment',
        component: () => import('@/pages/comment'),
        meta: {
          title: 'Mess-收到评论'
        }
      },
      {
        name:'search',
        path: '/search',
        component: () => import('@/pages/search'),
        meta: {
          title: 'Mess-搜索'
        }
      },
      {
        name:'traninfomanage',
        path: '/traninfomanage',
        component: () => import('@/pages/traninfomanage'),
        meta: {
          title: 'Mess-交易管理'
        }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// 路由前置导航守卫
router.beforeEach((to,from,next)=>{
  // 根据路由元信息设置文档标题
  window.document.title = to.meta.title || admin
  next()
})

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
