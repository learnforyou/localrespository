
//敌机组
var enemyG = cc.Class({
    name:'enemyG',
    properties: {
        name:'',
        freqTime : {
            default:[],
            type : cc.Float,
            tooltip:'fuckyou'
        },
        initPollCount:0,
        prefab:cc.Prefab
    }
});

cc.Class({
    extends: cc.Component,

    properties:()=>({
        enemyG: {
            default:[],
            type: enemyG
        },
        main: {
            default: null,
            type: require('main'),
        },
    }),
    
    // use this for initialization
    onLoad: function () { 
        //初始化敌机组
        this.eState = D.commonInfo.gameState.none;
        D.common.batchInitObjPool(this,this.enemyG);
    },
    startAction: function(eindex,tindex,want){
        
        this.eState = D.commonInfo.gameState.start;
        if(want)
        {
            //var emindex = eindex-3;
            // for(var emindex = eindex-3;emindex<eindex;emindex++){
            //     var ufName = 'callback_'+emindex;
            //     this.unschedule(this[ufName]);
            // }
            this.unscheduleAllCallbacks();
        }
        //定时生成敌机
        // for (var ei=0; ei< this.enemyG.length; ++ei){
        //     var freqTime = this.enemyG[ei].freqTime[0];
        //     var fName = 'callback_'+ei;
        //     this[fName] = function(e){ this.getNewEnemy(this.enemyG[e]); }.bind(this, ei);
        //     this.schedule(this[fName], freqTime);
        // }
        var enemyindex = eindex+3;
        for(let ei=eindex;ei<enemyindex;ei++)
        {
            var freqTime = this.enemyG[ei].freqTime[tindex];
            var fName ='callback_'+ei;
            this[fName] = function(e){this.getNewEnemy(this.enemyG[e]);}.bind(this,ei);
            this.schedule(this[fName],freqTime);
        }
    },
    //重新开始
    resumeAction: function(){
        this.enabled = true;
        this.eState = D.commonInfo.gameState.start;
    },
    //暂停
    pauseAction: function(){
        this.enabled = false;
        this.eState = D.commonInfo.gameState.pause;
        
    },
    //生成敌机
    getNewEnemy: function(enemyInfo) {
        var poolName = enemyInfo.name + 'Pool';
        var newNode = D.common.genNewNode(this[poolName],enemyInfo.prefab,this.node);
        var newV2 = this.getNewEnemyPositon(newNode);
        newNode.setPosition(newV2);
        newNode.getComponent('enemy').init();
    },
    //敌机随机生成的位置
    getNewEnemyPositon: function(newEnemy) {
        //位于上方，先不可见
        var randx = cc.randomMinus1To1()*(this.node.parent.width/2-newEnemy.width/2);
        var randy = this.node.parent.height/2+newEnemy.height/2;
        return cc.v2(randx,randy);
    },
    enemyDied: function(nodeinfo,score){
        //回收节点
        D.common.backObjPool(this,nodeinfo);
        //增加分数
        if (parseInt(score)>0){
            this.main.gainScore(score);
        }  
    },
    getScore: function(){
        return this.main.getScore();
    },

    killAllEnemy:function(){
        var enemys = this.node.children;
        for (let loop = 0; loop < this.node.childrenCount; ++loop) {
            if(enemys[loop].group == "enemy"){
                enemys[loop].getComponent('enemy').onDead(enemys[loop].name);
            }
         }
    }
    // called every frame, uncomment this function to activate update callback
    //update: function (dt) {
        
    //},
    
});
