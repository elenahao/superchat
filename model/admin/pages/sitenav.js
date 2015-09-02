'use strict';

var _nav = function() {
    this.init();
};

_nav.prototype = {
    init: function() {

    },
    getSiteNav: function() {
        return {
            question: {
                id: 0,
                name: '题目管理',
                href: '/admin/question'
            },
            playset: {
                id: 2,
                name: '题集管理',
                href: '/admin/playset'
            },
            user: {
                id: 3,
                name: '用户管理',
                href: '/admin/user'
            },
            robot: {
                id: 4,
                name: '机器人管理',
                href: '/admin/robot'
            },
            achievement: {
                id: 5,
                name: '成就管理',
                href: '/admin/achivment'
            }

        }
    }
};

module.exports = new _nav();
