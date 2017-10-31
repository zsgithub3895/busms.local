package com.sihuatech.basicdata.enums.nibernate.dao;

import java.io.Serializable;

/**
 * 封装SpringSide扩展功能的Hibernat泛型基类.
 * 
 * 扩展功能包括分页查询,按属性过滤条件列表查询.
 * 可在Service层直接使用,也可以扩展泛型DAO子类使用,见两个构造函数的注释.
 * 
 * @param <T> DAO操作的对象类型
 * @param <PK> 主键类型
 * 
 */
public class HibernateDao<T, PK extends Serializable> extends com.onewaveinc.core.db.HibernateDao<T,PK>{
	
}
