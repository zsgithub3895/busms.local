package com.sihuatech.basicdata.enums.util;

import java.math.BigDecimal;

public class NumberUtil {
	
	private static int HOUR_MILLI = 60*60*1000;
	private static int MINUTE_MILLI = 60*1000;
	
	public static double milliToHour(Object milli,int scale){
		BigDecimal big;
		if(milli instanceof String){
			big = new BigDecimal((String)milli);
		}else if(milli instanceof Integer){
			big = new BigDecimal((Integer)milli);
		}else if(milli instanceof Long){
			big = new BigDecimal((Long)milli);
		}else if(milli instanceof Double){
			big = new BigDecimal((Double)milli);
		}else if(milli instanceof Float){
			big = new BigDecimal((Float)milli);
		}else{
			big = new BigDecimal((String)milli);
		}
		return big.divide(new BigDecimal(HOUR_MILLI), scale, BigDecimal.ROUND_HALF_UP).doubleValue();
	}
	
	public static double milliToMinute(Object milli,int scale){
		BigDecimal big;
		if(milli instanceof String){
			big = new BigDecimal((String)milli);
		}else if(milli instanceof Integer){
			big = new BigDecimal((Integer)milli);
		}else if(milli instanceof Long){
			big = new BigDecimal((Long)milli);
		}else if(milli instanceof Double){
			big = new BigDecimal((Double)milli);
		}else if(milli instanceof Float){
			big = new BigDecimal((Float)milli);
		}else{
			big = new BigDecimal(0);
		}
		return big.divide(new BigDecimal(MINUTE_MILLI), scale, BigDecimal.ROUND_HALF_UP).doubleValue();
	}
	
	public static float formatFloat(float number,int scale){
		BigDecimal big = new BigDecimal(number);
		big = big.setScale(scale, BigDecimal.ROUND_HALF_UP);
		return big.floatValue();
	}
	
	public static double formatDouble(double number,int scale){
		BigDecimal big = new BigDecimal(number);
		big = big.setScale(scale, BigDecimal.ROUND_HALF_UP);
		return big.doubleValue();
	}
	
	public static void main(String[] args) {
		System.out.println(formatFloat(0.12352f,3));
	}
}
