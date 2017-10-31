package com.sihuatech.task;

import java.util.List;

import com.onewaveinc.core.common.task.Job;
import com.onewaveinc.core.common.task.JobContext;
import com.onewaveinc.core.common.task.entity.Task;
import com.sihuatech.task.service.RequestCenterService;
import com.sihuatech.task.util.ServiceLocator;

public class CenterTimeTask implements Job {
	@Override
	public void execute(JobContext context) {
		Task task=context.getTask();
		Long taskId=task.getId();
		try {
			RequestCenterService rcs = (RequestCenterService) ServiceLocator.getBean("com.sihuatech.task.service.RequestCenterService");		
			rcs.doTask(taskId);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	@Override
	public float getPercent() {
		// TODO Auto-generated method stub
		return 0;
	}

	@Override
	public Object getWorking() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List getFinished() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List getToBeDone() {
		// TODO Auto-generated method stub
		return null;
	}

}
