package com.sihuatech.user.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.apache.commons.lang.StringUtils;

import com.onewaveinc.bumblebee.core.util.SearchResult;
import com.onewaveinc.common.annotation.bumblebee.Bean;
import com.onewaveinc.common.annotation.bumblebee.Delete;
import com.onewaveinc.common.annotation.bumblebee.Get;
import com.onewaveinc.common.annotation.bumblebee.Path;
import com.onewaveinc.common.annotation.bumblebee.Post;
import com.onewaveinc.common.annotation.bumblebee.Put;
import com.onewaveinc.common.annotation.bumblebee.QueryVariable;
import com.onewaveinc.common.annotation.bumblebee.Resource;
import com.onewaveinc.common.security.SecurityService;
import com.onewaveinc.common.security.User;
import com.onewaveinc.common.security.manager.DefaultUserManager;
import com.onewaveinc.core.db.PropertyFilter;
import com.onewaveinc.core.db.PropertyFilter.MatchType;
import com.onewaveinc.core.page.PageBean;
import com.onewaveinc.core.page.SearchResultHelper;
import com.sihuatech.user.entity.DefaultUser;
import com.sihuatech.user.manager.UserManager;

@Resource("ngUser")
@Bean("com.sihuatech.user.service.UserService")
public class UserService {

	private UserManager userManager;
	
	private SecurityService securityService;
	
	private DefaultUserManager<com.onewaveinc.common.security.DefaultUser> defaultUserManager;
		
	public void setDefaultUserManager(DefaultUserManager<com.onewaveinc.common.security.DefaultUser> defaultUserManager) {
		this.defaultUserManager = defaultUserManager;
	}
	/*
	 * 批量做逻辑删除
	 * 
	 * @param ids
	 * 
	 * @return
	 */
	@Delete
	public String del(Long[] ids) {
		User user = securityService.getCurrentUser();
		DefaultUser dUser = this.get(user.getId());
		String msg = "";
		if (ids.length > 0) {
			try {
				for (int i = 0; i < ids.length; i++) {
					if(ids[i]==dUser.getId()){
						msg="当前用户不能删除！";
					}else{
						defaultUserManager.delete(ids[i]);
					}
				}
				msg = "删除成功!";
			} catch(Exception e) {
				msg="删除失败!";
			}
		} else {
			msg = "请选择要删除的用户";
		}
		return msg;
	}
    @Get
    @Path("{id}")
    public DefaultUser get(long id) {
		return this.userManager.get(id);
    }

    /**
     * �޸�
     * @param id
     * @param user
     */
    @Put
    @Path("update/{id}")
    public void update(long id, DefaultUser user) {
    	this.userManager.update(id,user.getCityId());
    }
    
    @Post
    public void create(DefaultUser user) {
    	this.userManager.create(user.getCityId(),user.getLoginName());
    }
    @Resource("ngUsers")
    @Get
    @Path("{searchName}/{loginName}/{status}/{cityId}")
    public SearchResult search(String searchName, String loginName, int status,String cityId,@QueryVariable PageBean<DefaultUser> pageBean) {
    	List<PropertyFilter> filters = new ArrayList<PropertyFilter>();
    	if(StringUtils.isNotBlank(searchName)){
    		filters.add(new PropertyFilter("name", "%" + searchName + "%", MatchType.LIKE));
    	}
    	if(StringUtils.isNotBlank(loginName)){
    		filters.add(new PropertyFilter("loginName", "%" + loginName + "%", MatchType.LIKE));
    	}
    	if(status > 0){
        	filters.add(new PropertyFilter("status", status, MatchType.EQ));
    	}
    	if(!cityId.equals("0")){
    		filters.add(new PropertyFilter("cityId", cityId, MatchType.EQ));
    	}
        return SearchResultHelper.create(userManager.search(pageBean, filters));
    }
    
    /**
     * ��ȡ��ǰ�û����������
     * @return
     */
	public List<String> getByUser() {
		List<String> result = new ArrayList<String>();
		long userId = securityService.getCurrentUser().getId();
		DefaultUser user = this.userManager.get(userId);
		if (user != null && user.getLoginName().equals("admin")) {
			result.add("admin");
			return result;
		} else if (user != null) {
			if (StringUtils.isNotBlank(user.getCityId())) {
				return Arrays.asList(user.getCityId().split(","));
			} else {
				return result;
			}
		} else {
			return result;
		}
	}

	
	public List<Long> filterUser(List<Long> cityId) {
		List<Long> result = new ArrayList<Long>();
		long userId = securityService.getCurrentUser().getId();
		DefaultUser user = this.userManager.get(userId);
		if (user != null && user.getLoginName().equals("admin")) {
			return cityId;
		} else if (user != null) {
			if (StringUtils.isNotBlank(user.getCityId())) {
				List<String> list = Arrays.asList(user.getCityId().split(","));
				for (Long c : cityId) {
					String cc = String.valueOf(c);
					if (list.contains(cc)) {
						result.add(c);
					}
				}
				return result;
			} else {
				return result;
			}
		} else {
			return result;
		}
	}
	@Get
	@Path("currentuser")
    public String  getCurrentUser(){
		User user = securityService.getCurrentUser();
		DefaultUser dUser = this.get(user.getId());
		return dUser.getCityId();
    }
	
	public UserManager getUserManager() {
		return userManager;
	}

	public void setUserManager(UserManager userManager) {
		this.userManager = userManager;
	}

	public SecurityService getSecurityService() {
		return securityService;
	}

	public void setSecurityService(SecurityService securityService) {
		this.securityService = securityService;
	}

}
