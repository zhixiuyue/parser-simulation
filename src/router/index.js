import { createRouter, createWebHashHistory } from "vue-router";
import Home from "@/views/Home.vue";
import store from "../store";

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Home",
      component: Home,
    },
    {
      path: "/LL1",
      name: "LL1",
      component: Home,
      children: [
        // route level code-splitting
        // this generates a separate chunk (About.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        {
          path: "/LL1/LL1Grammar",
          name: "LL1Grammar",
          component: () => import("@/views/GrammarJudge.vue"),
        },
        {
          path: "/LL1/LL1Table",
          name: "LL1Table",
          component: () => import("@/views/LL1Table.vue"),
        },
        {
          path: "/LL1/LL1Analysis",
          name: "LL1Analysis",
          component: () => import("@/views/LL1Analysis.vue"),
        },
      ],
    },
    {
      path: "/LR0",
      name: "LR0",
      component: Home,
      children: [
        {
          path: "/LR0/LR0Table",
          name: "LR0Table",
          component: () => import("@/views/LR0Table.vue"),
          props: true,
        },
        {
          path: "/LR0/Automaton",
          name: "Automaton",
          component: () => import("@/views/Automaton.vue"),
        },
        {
          path: "/LR0/LR0Analysis",
          name: "LR0Analysis",
          component: () => import("@/views/LR0Analysis.vue"),
          props: true,
        },
      ],
    },
    {
      path: "/LR1LALR",
      name: "LR1LALR",
      component: Home,
      children: [
        {
          path: "/LR1LALR/LR1LALRTable",
          name: "LR1LALRTable",
          component: () => import("@/views/LR1LALRTable.vue"),
          props: true,
        },
        {
          path: "/LR1LALR/Automaton",
          name: "Automaton",
          component: () => import("@/views/Automaton.vue"),
        },
        {
          path: "/LR1LALR/LR1LALRAnalysis",
          name: "LR1LALRAnalysis",
          component: () => import("@/views/LR1LALRAnalysis.vue"),
          props: true,
        },
      ],
    },
  ],
});

router.beforeEach((to, from, next) => {
  if (to.path == "/") {
    next();
  } else {
    if (!store.state.grammarStore.grammar.length) {
      next("/");
    } else {
      next();
    }
  }
});

export default router;
