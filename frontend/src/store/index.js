import { createStore } from 'vuex'
import auth from './modules/auth'
import equipment from './modules/equipment'
import sites from './modules/sites'
import departments from './modules/departments'

export default createStore({
  modules: {
    auth,
    equipment,
    sites,
    departments
  }
}) 