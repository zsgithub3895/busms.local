package com.sihuatech.user.manager;

import java.util.List;

import com.onewaveinc.core.db.DefaultEntityManager;
import com.sihuatech.user.entity.DefaultUser;
public class UserManager extends DefaultEntityManager<DefaultUser, Long> {

	public void update(long id, String cityId) {
		final String hql = "update com.sihuatech.user.entity.DefaultUser a set a.cityId = ? where a.id = ?";
		this.getEntityDao().excute(hql, new Object[] { cityId, id });
	}
	public void create(String cityId, String loginName) {
		final String hql = "update com.sihuatech.user.entity.DefaultUser a set a.cityId = ? where a.loginName = ?";
		this.getEntityDao().excute(hql, new Object[] { cityId, loginName });
	}
	
	public boolean getByCitycode(String code){
		 String hql = "from com.sihuatech.user.entity.DefaultUser a where a.cityId = ?";
		 List<DefaultUser>  list =this.search(hql, new Object[] {code});
		 if(list.size()>0){
			 return true;
		 }
		 return false;
	}
}
