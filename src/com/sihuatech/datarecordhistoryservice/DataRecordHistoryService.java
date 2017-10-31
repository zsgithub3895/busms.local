package com.sihuatech.datarecordhistoryservice;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.apache.commons.lang.StringUtils;

import com.onewaveinc.bumblebee.core.util.SearchResult;
import com.onewaveinc.common.annotation.bumblebee.Bean;
import com.onewaveinc.common.annotation.bumblebee.Get;
import com.onewaveinc.common.annotation.bumblebee.Resource;
import com.onewaveinc.core.db.PropertyFilter;
import com.onewaveinc.core.db.PropertyFilter.MatchType;
import com.onewaveinc.core.page.PageBean;
import com.onewaveinc.core.page.SearchResultHelper;
import com.onewaveinc.mip.log.Logger;
import com.sihuatech.datarecord.entity.DataRecordHistory;
import com.sihuatech.datarecord.manager.DataRecordHistoryManager;
import com.sihuatech.datarecordstatusservice.DataRecordStatusService;

@Resource("DataRecordHistoryService")
@Bean("com.sihuatech.DataRecordHistoryService")
public class DataRecordHistoryService {
	private Logger logger = Logger.getInstance(DataRecordStatusService.class);
	private DataRecordHistoryManager  dataRecordHistoryManager;
	
   public void setDataRecordHistoryManager(
			DataRecordHistoryManager dataRecordHistoryManager) {
		this.dataRecordHistoryManager = dataRecordHistoryManager;
	}

	@Get
	public SearchResult search(String cityCode, String interfaceType, String interfaceName, Date beginTime,
			Date endTime, int respCorrect, PageBean<DataRecordHistory> pageBean) {
		List<PropertyFilter> properties = new ArrayList<PropertyFilter>();
		if (StringUtils.isNotBlank(cityCode) && !cityCode.equals("0")) {
			properties.add(new PropertyFilter("cityCode", cityCode, MatchType.EQ));
		}
		if (StringUtils.isNotBlank(interfaceType) && !interfaceType.equals("0")) {
			properties.add(new PropertyFilter("interfaceType", interfaceType, MatchType.EQ));
		}
		if (StringUtils.isNotBlank(interfaceName)) {
			properties.add(new PropertyFilter("interfaceName", interfaceName, MatchType.LIKE));
		}
		if (beginTime != null) {
			properties.add(new PropertyFilter("sentTime", beginTime, MatchType.GE));
		}
		if (endTime != null) {
			properties.add(new PropertyFilter("sentTime", endTime, MatchType.LE));
		}
		properties.add(new PropertyFilter("respCorrect", respCorrect, MatchType.EQ));
		pageBean = dataRecordHistoryManager.search(pageBean, properties);
		return SearchResultHelper.create(pageBean);
	}
}
