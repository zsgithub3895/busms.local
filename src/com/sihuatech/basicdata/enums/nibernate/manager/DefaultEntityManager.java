package com.sihuatech.basicdata.enums.nibernate.manager;

import java.io.Serializable;
import java.math.BigDecimal;
import java.math.BigInteger;
import java.sql.SQLException;
import java.util.List;

import org.hibernate.HibernateException;
import org.hibernate.Query;
import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.springframework.orm.hibernate3.HibernateCallback;
import org.springframework.util.Assert;

import com.onewaveinc.core.page.PageBean;

/**
 * 含默认泛型DAO的EntityManager.
 *
 * @param <T> 领域对象类型
 * @param <PK> 领域对象的主键类型
 * 
 * eg.
 * public class UserManager extends DefaultEntityManager<User, Long>{ 
 * }
 * 
 */
public class DefaultEntityManager<T, PK extends Serializable> extends com.onewaveinc.core.db.DefaultEntityManager<T, PK> {
	public List findBySql(final PageBean page, final String sql) {
		
		Assert.notNull(page, "page不能为空");
		List result = getHibernateTemplate().executeFind(new HibernateCallback() {
			public Object doInHibernate(Session session) throws HibernateException, SQLException {
				Query q = session.createSQLQuery(sql);
				q.setFirstResult(page.getFirst());
				q.setMaxResults(page.getPageSize());
				page.setRecordCount(count(sql));
				return q.list();
			}
		});
		page.setResult(result);
		return result;
	}
	private int count(String queryString) {
		final String countQueryString = createCountQL(queryString);
		Object obj = getHibernateTemplate().execute(new HibernateCallback() {
		public Object doInHibernate(Session session) throws HibernateException, SQLException {
			Query countQuery = session.createSQLQuery(countQueryString);
			List<Object> res = countQuery.list();
			if (res != null && res.size() > 0) {
				BigInteger countValue = (BigInteger)res.get(0);
				return countValue.longValue();
			}
			return new Long(0L);
			}
		});
		return ((Long)obj).intValue();
	}
	private String createCountQL(String queryStr) {
		int idxF = queryStr.indexOf("from");

		int idxD = queryStr.indexOf("distinct");

		if (idxD > 0) {
			String result = queryStr.substring(idxD + "distinct".length(), idxF);

			return "select distinct count(" + result + ") " + queryStr.substring(idxF);
		} else {
			return "select count(*) " + queryStr.substring(idxF);
		}

	}
	protected List executeQueryForList(final String sql) {
		return (List)getEntityDao().getHibernateTemplate().execute(new HibernateCallback() {
			public Object doInHibernate(Session session)
					throws HibernateException {
				SQLQuery q = session.createSQLQuery(sql);
				List l = q.list();
				return l;
			}
		});
	}

}
