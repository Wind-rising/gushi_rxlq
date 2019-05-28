// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class CountMessageType {

    public static  noSkillShootGoal:  number = 1;
		
    public static  skillShootGoal:  number = 2;
    
    public static  noSkillShootNoGoal:  number = 3;
    
    public static  skillShootNoGoal:  number = 4;
    
    public static  noSkillThreeGoal:  number = 5;
    
    public static  skillThreeGoal:  number = 6;
    
    public static  noSkillThreeNoGoal:  number = 7;
    
    public static  skillThreeNoGoal:  number = 8;
    
    public static  noSkillSlamdunk:  number = 9;
    
    public static  skillSlamdunk:  number = 10;
    
    public static  noSkillNoDunk:  number = 11;
    
    public static  skillNoDunk:  number = 12;
    
    public static  rebound:  number = 13;
}
