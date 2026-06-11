import { createStore } from 'vuex';

export default createStore({
  state: {
    isCollapse: false,
    token: null,
    isAuth: false,
    isLoad: false,
    leftMenu: null,
    menuList: null,
    menuList: null,
    activeMenu: null,
    activeChildren: null,
    followUpStatus: null,
    isOnMobile: false,
    app: {
      name: 'wahana-crm',
      version: null,
    },
    user: {
      aud: null,
      code: null,
      exp: null,
      iat: null,
      id: null,
      iss: null,
      name: null,
      session: null,
      type: null,
      typer: null,
    },
    account: {
      accountCode: null,
      accountId: null,
      accountName: null,
      companyCode: null,
      companyId: null,
      companyName: null,
      companyDrpRole: {},
      drpRole: {},
      employmentRole: {},
      ownerCode: null,
      ownerId: null,
      ownerName: null,
      tag: null,
      group: null,
    },
    jabatan: {
      label: null,
      value: null,
    },
    useBlankPage: false,
  },
  mutations: {
    setCollapse(state) {
      state.isCollapse = !state.isCollapse;
    },
    setAuth(state, token) {
      state.isAuth = true;
      state.token = token;
    },
    setLoad(state) {
      state.isLoad = true;
    },
    unsetLoad(state) {
      state.isLoad = false;
    },
    setLeftMenu(state, leftMenu) {
      state.leftMenu = leftMenu;
    },
    setOnMobile(state) {
      state.isOnMobile = true;
      state.isCollapse = true;
    },
    setLogout(state) {
      state.token = null;
      state.isAuth = false;
    },
    setActiveMenu(state, activeMenu) {
      state.activeMenu = activeMenu;
    },
    setActiveChildren(state, activeChildren) {
      state.activeChildren = activeChildren;
    },
    setUser(state, user) {
      state.user.aud = user.aud;
      state.user.code = user.code;
      state.user.exp = user.exp;
      state.user.iat = user.iat;
      state.user.id = user.id;
      state.user.iss = user.iss;
      state.user.name = user.name;
      state.user.session = user.session;
      state.user.type = user.type;
      state.user.typer = user.typer;
    },
    setAccount(state, account) {
      state.account.accountCode = account.accountCode;
      state.account.accountId = account.accountId;
      state.account.accountName = account.accountName;
      state.account.companyCode = account.companyCode;
      state.account.companyId = account.companyId;
      state.account.companyName = account.companyName;
      state.account.companyDrpRole = account.companyDrpRole;
      state.account.drpRole = account.drpRole;
      state.account.employmentRole = account.employmentRole;
      state.account.ownerCode = account.ownerCode;
      state.account.ownerId = account.ownerId;
      state.account.ownerName = account.ownerName;
      state.account.tag = account.tag;
      state.account.group = account.group;
    },
    setJabatan(state, jabatan) {
      state.jabatan.label = jabatan.label;
      state.jabatan.value = jabatan.value;
    },
    setMenuList(state, menuList) {
      state.menuList = menuList;
    },
    setFollowUpStatus(state, status) {
      state.followUpStatus = status;
    },
  },
  getters: {
    isCollapse(state) {
      return state.isCollapse;
    },
    token(state) {
      return state.token;
    },
    isAuth(state) {
      return state.isAuth;
    },
    leftMenu(state) {
      return state.leftMenu;
    },
    menuList(state) {
      return state.menuList;
    },
    isOnMobile(state) {
      return state.isOnMobile;
    },
    activeMenu(state) {
      return state.activeMenu;
    },
    activeChildren(state) {
      return state.activeChildren;
    },
    currentMenuName(state) {
      if (state.activeChildren?.name) return state.activeChildren?.name;
      if (state.activeMenu) return state.activeMenu?.items[0]?.name;
      return null;
    },
    userId(state) {
      return state.user.aud;
    },
    userName(state) {
      return state.user.name;
    },
    userCode(state) {
      return state.user.code;
    },
    userRole(state) {
      return state.account?.drpRole?.roles?.[0] ?? null
    },    
    userGroup(state) {
      return state.account.group;
    },
    accountCode(state) {
      return state.account.accountCode;
    },
    accountName(state) {
      return state.account.accountName;
    },
    accountId(state) {
      return state.account.accountId;
    },
    companyCode(state) {
      return state.account.companyCode;
    },
    companyName(state) {
      return state.account.companyName;
    },
    companyId(state) {
      return state.account.companyId;
    },
    jabatanValue(state) {
      return state.jabatan.value;
    },
    jabatanLabel(state) {
      return state.jabatan.label
    },
    tag(state) {
      return state.account.tag
    }
  },
  actions: {},
});
