package com.sihuatech.basicdata.enums.enums.manager;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.List;

import bsh.util.Util;

import com.onewaveinc.core.db.DefaultEntityManager;
import com.onewaveinc.core.utils.StringUtil;
import com.sihuatech.basicdata.enums.enums.entity.EnumItem;
import com.sihuatech.basicdata.enums.enums.entity.Enumeration;


public class EnumItemManager extends DefaultEntityManager<EnumItem, Long>{
	
	public void deleteEnumItemByParentId(long parentId) {
		String hql = "delete EnumItem e where e.parentid=?";
		this.excute(hql, new Object[] {parentId });
	}
	
	public void deleteEnumItemByEnumId(long enumId) {
		String hql = "delete EnumItem e where e.enumId=?";
		this.excute(hql, new Object[] {enumId});
	}
	
	public List<EnumItem> listByEnumIdAndParentId(long enumId, long parentId) {
		String hql = "select e from EnumItem e where e.enumId=? and e.parentid=?";
		return this.search(hql, new Object[] { enumId, parentId });
	}
	
	public List<EnumItem> findByParentId(long parentId) {
		String hql = "from EnumItem e where e.parentid=?";
		return this.search(hql, new Object[]{parentId});
	}
	
	public boolean getByCode(long enumId, String code) {
		String hql = "select e from EnumItem e where e.code=? and e.enumId=? ";
		Object[] param = new Object[] { code, enumId };
		List<EnumItem> list = this.search(hql, param);
		return list.size() > 0 ? true : false;
	}
	
	public List<EnumItem> findByEnumId(long enumId, long sortType) {
		String hql = null;
		if (sortType == 1) {
			hql = "from EnumItem e where e.enumId=? order by e.sortIndex asc";
		} else {
			hql = "from EnumItem e where e.enumId=? order by e.sortIndex desc";
		}
		return this.search(hql, enumId);
	}
	
	public List<EnumItem> findByParentIdAndSortType(long id, String name,long parentId, long sortType) {
		String hql = "";
		if (sortType == 1) {
			hql = "from EnumItem e where e.enumId=?  and  e.parentid=? and e.code!='null' order by e.sortIndex asc";
		} else {
			hql = "from EnumItem e where e.enumId=?  and  e.parentid=? and e.code!='null' order by e.sortIndex desc";
		}
		return this.search(hql, new Object[] { id,parentId });
	}
	
	public EnumItem isExit(long enumId, String code,long parentId) {
		String hql = "from EnumItem e where e.code=? and e.enumId=? and e.parentid=?";
		Object[] param = new Object[] { code, enumId ,parentId};
		List<EnumItem> list = this.search(hql, param);
		if(null==list||(list!=null&&list.size()<=0)){
			return null;
		}else{
			return list.get(0);
		}
	}
	
	public EnumItem nameIsExit(long enumId, String name) {
		String hql = "from EnumItem e where e.name=? and e.enumId=?";
		Object[] param = new Object[] { name, enumId };
		List<EnumItem> list = this.search(hql, param);
		if(null==list||(list!=null&&list.size()<=0)){
			return null;
		}else{
			return list.get(0);
		}
	}
 
	public EnumItem getByEnumerationCodeAndEnumItemCode(String enumerationCode, String enumItemCode) {
		String hql = "select ei from Enumeration e, EnumItem ei where e.id = ei.enumId and e.code = ? and ei.code = ?";
		Object[] param = new Object[] { enumerationCode, enumItemCode };
		List<EnumItem> list = this.search(hql, param);
		if(null==list||(list!=null&&list.size()<=0)){
			return null;
		}else{
			return list.get(0);
		}
	}
	
	/**通过一级分类获取对应的二级分类目录*/
	public List<EnumItem> getSubCategoryOptions(String code){
		StringBuffer sqlBuf = new StringBuffer();
		sqlBuf.append(" from EnumItem  en  where 1=1")
	      .append(" and en.status = " + 1 +"") 
	      .append(" and en.parentid =").append("(select en.id from EnumItem en where en.status = " + 1 + " and en.code= '" +code + "')");
		return  this.search(sqlBuf.toString(),null);
	}
	
	public List<EnumItem> getCaptionOptions(){
		StringBuffer sqlBuf = new StringBuffer();
		sqlBuf.append(" from EnumItem  en  where 1=1")
	      .append(" and en.status = " + 1 +"") 
	      .append(" and en.enumId =").append("(select ea.id from Enumeration ea where ea.code= 'CAPTION')");
		return  this.search(sqlBuf.toString(),null);
	}
	
	public String getNameByCode(String code){
		String hql = " from EnumItem e where e.code=?";
		List<EnumItem> list = this.search(hql, new Object[]{code});
		return list.size()>0?list.get(0).getName():code;
	}
	
	public boolean isCode(String code){
		String hql = " from EnumItem e where e.code=?";
		List<EnumItem> list = this.search(hql, new Object[]{code});
		if( null !=list && list.size()>0){
			return true;
		}
		return false;
	}
	
	public static void main(String[] args) {
		File file = new File("C:\\Users\\liuwen\\Desktop\\新建文本文档.txt");
		BufferedReader br = null;
		try {
			FileInputStream fis = new FileInputStream(file);
			br = new BufferedReader(new InputStreamReader(fis));
			StringBuilder sb = new StringBuilder();
			String str="";
			while((str = br.readLine()) != null){
				sb.append(str);
			}
			String[] entry = sb.toString().split(",");
			for(int i=0;i<entry.length;i++){
				String[] kv = entry[i].trim().split("=");
			}
		} catch (Exception e) {
			e.printStackTrace();
		}finally{
			if(br != null){
				try {
					br.close();
				} catch (IOException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
		}
	}

	public List<EnumItem> findByParentIdAndSortTypeAndName(long id, String name, long parentId, long sortType) {
		String hql = "";
		if (sortType == 1) {
			hql = "from EnumItem e where e.enumId=? and e.name like ? and  e.parentid=? and e.code!='null' order by e.sortIndex asc";
		} else {
			hql = "from EnumItem e where e.enumId=? and e.name like ? and  e.parentid=? and e.code!='null' order by e.sortIndex desc";
		}
		name = "%" + name + "%";
		return this.search(hql, new Object[] { id,name,parentId });
	}
	
	public String getById(long id) {
		String hql = "select e from EnumItem e where e.id=?";
		List<EnumItem> list = this.search(hql, id);
		if(null==list||(list!=null&&list.size()<=0)){
			return null;
		}else{
			return list.get(0).getCode();
		}
	}
}
