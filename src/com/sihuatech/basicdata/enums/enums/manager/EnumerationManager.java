package com.sihuatech.basicdata.enums.enums.manager;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang.StringUtils;

import com.onewaveinc.bumblebee.core.util.SearchResult;
import com.onewaveinc.core.db.DefaultEntityManager;
import com.onewaveinc.core.db.PropertyFilter;
import com.onewaveinc.core.db.PropertyFilter.MatchType;
import com.onewaveinc.core.page.PageBean;
import com.onewaveinc.core.page.SearchResultHelper;
import com.sihuatech.basicdata.enums.enums.entity.Enumeration;

public class EnumerationManager extends DefaultEntityManager<Enumeration, Long>{
	/**
	 * 查询枚举值
	 * @param name
	 * @param code
	 * @param pageBean
	 * @return
	 */
	public SearchResult getAllStorage(String name, String code, PageBean<Enumeration> pageBean) {
		/*StringBuilder hql = new StringBuilder();
		hql.append("from Enumeration t where 1=1 ");
		if (StringUtils.isNotBlank(name)) {
			hql.append("and t.name like ? ");
		}
		if (StringUtils.isNotBlank(code)) {
			hql.append("and t.code like ? ");
		}
		PageBean<Enumeration> page = this.getPage(pageBean, hql.toString(), name + "%", code + "%");
		*/
		List<PropertyFilter> params = new ArrayList<PropertyFilter>();
		if (StringUtils.isNotBlank(name)) {
			String temp_name = name.replaceAll("%","/%");
			params.add(new PropertyFilter("name", temp_name, MatchType.LIKE));
		}
		if (StringUtils.isNotBlank(code)) {
			String temp_code = code.replaceAll("%","/%");
			params.add(new PropertyFilter("code", temp_code, MatchType.LIKE));
		}
		PageBean<Enumeration> page = this.search(pageBean, params);
		return SearchResultHelper.create(page.getResult(), page);
	}
	
	public Enumeration getEnumByCode(String code) {
		String hql = "select e from Enumeration e where e.code=?";
		List<Enumeration> list = this.search(hql, code);
		return list.size() > 0 ? list.get(0) : null;
	}
	
	public boolean getByCode(String code) {
		String hql = "select e from Enumeration e where e.code=?";
		List<Enumeration> list = this.search(hql, code);
		return list.size() > 0 ? true : false;
	}
	
	public long getEnumNameById(long id){
		String hql = "select e from Enumeration e where e.id=?";
		List<Enumeration> list = this.search(hql, id);
		return list.size() > 0?list.get(0).getId():0;
	}
	public String getById(long id) {
		String hql = "select e from Enumeration e where e.id=?";
		List<Enumeration> list = this.search(hql, id);
		return list.get(0).getCode();
	}
	
}
