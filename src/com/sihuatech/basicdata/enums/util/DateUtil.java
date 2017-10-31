package com.sihuatech.basicdata.enums.util;

import java.sql.Timestamp;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;

import com.onewaveinc.mip.log.Logger;

 

/**
 * 
 * Description:
 * 
 * @author  create on 2013-06-18
 * 
 */
public class DateUtil {

	private static Logger logger = Logger.getInstance(DateUtil.class.getName());

	public final static String LONG_DATE_FORMAT = "yyyy-MM-dd HH:mm:ss:SSS";

	public final static String SHORT_DATE_FORMAT = "yyyy-MM-dd HH:mm:ss";

	public final static String LONG_DATE_FORMAT2 = "yyyyMMddHHmmss";

	public final static String LONG_DATE_FORMAT3 = "yyyyMMddHHmm";

	public final static String ONLY_DATE_FORMAT = "yyyy-MM-dd";

	public final static String YYYMMDD_FORMAT = "yyyyMMdd";
	
	public final static String YYYMMDDHH_FORMAT = "yyyyMMddHH";

	public final static String YYYMMDD_WITH_SLASH_FORMAT = "yyyy/MM/dd";
	
	public final static String YYMMDD_FORMAT = "yy/MM/dd";

	public final static String YYYMMDD_WITH_SLASH_FORMAT2 = "yyyy/MM/dd HH:mm";

	public final static String SHORT_TIME_FORMAT = "HH:mm";

	public final static String LONG_TIME_FORMAT = "HH:mm:ss";
	
	public static Date parseDate(String src, String format) {
		Date date = null;
		if (src == null || src.equals(""))
			return null;
		try {
			date = new SimpleDateFormat(format).parse(src);
		} catch (Exception e) {
			logger.error(src + "不符合规格！");
			throw new RuntimeException(e);
		}
		return date;
	}

	public static Timestamp parseTimestamp(String src, String format) {
		Date date = null;
		if (src == null || src.equals(""))
			return null;
		try {
			date = new SimpleDateFormat(format).parse(src);
			return new Timestamp(date.getTime());
		} catch (Exception e) {
			logger.error("日期：" + src + "转换成Timestamp异常！", e);
			return new Timestamp(0L);
		}
	}

	public static String dateToString(Date d, String format) {
		if (d == null)
			return null;
		else
			return new SimpleDateFormat(format).format(d);
	}

	public static String dateToString(Timestamp d, String format) {
		if (d == null)
			return null;
		else
			return new SimpleDateFormat(format).format(new Date(d.getTime()));
	}

	public static String afterTheDate(String date, int d, String type) {
		// you must format the date to "yyyy-MM-dd"
		// you must give type in {"d","M","y"} types.
		// if type="d" then abs(d) must less then 28.
		// if type="M" then abs(d) must less then 12.
		if (d == 0)
			return date;
		if (type == null)
			return date;

		String year = date.substring(0, 4);
		int iyear = Integer.parseInt(year);
		String moth = date.substring(5, 7);
		int imoth = Integer.parseInt(moth);
		String day = date.substring(8, 10);
		int iday = Integer.parseInt(day);
		int[] days = { 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 };

		if (iyear % 400 == 0 || (iyear % 4 == 0 && iyear % 100 != 0))
			days[1] = 29;

		if (type.equals("d")) {
			if (iday + d > days[imoth - 1]) {
				iday = iday + d - days[imoth - 1];
				if (imoth == 12) {
					imoth = 1;
					iyear++;
				} else {
					imoth++;
				}
			} else if (iday + d <= 0) {
				if (imoth == 1) {
					imoth = 12;
					iyear--;
				} else {
					imoth--;
				}
				iday = days[imoth - 1] + iday + d;
			} else {
				iday = iday + d;
			}
		} else if (type.equals("M")) {
			if (imoth + d > 12) {
				imoth = (imoth + d) - 12;
				iyear++;
			} else if (imoth + d <= 0) {
				imoth = 12 + imoth + d;
				iyear--;
			} else {
				imoth--;
			}
		} else if (type.equals("y")) {
			iyear = iyear + d;
		} else {
			return null;
		}
		year = "" + iyear;
		moth = imoth < 10 ? "0" + imoth : "" + imoth;
		day = iday < 10 ? "0" + iday : "" + iday;
		System.out.println(moth);
		System.out.println(day);
		return year + "-" + moth + "-" + day;
	}

	public static Date parseStartDate(String date) {
		return str2Date(date + " 00:00:00", null);
	}

	public static Date parseEndDate(String date) {
		return str2Date(date + " 23:59:59", null);
	}

	/**
	 * 根据转换格式将字符串转换成日期类型
	 * 
	 * @param date
	 * @param pattern
	 * @return
	 * @throws ParseException
	 */
	public static Date str2Date(String date, String pattern) {
		if (pattern == null || pattern.trim().length() == 0) {
			pattern = "yyyy-MM-dd HH:mm:ss";
		}
		DateFormat format = new SimpleDateFormat(pattern);
		try {
			return format.parse(date);
		} catch (ParseException e) {
			return null;
		}
	}
	
	/**
	 * 日期加一天
	 * @param dateTime
	 * @return
	 */
	public static Date addDay(Date dateTime, int amount) {
		Calendar c = Calendar.getInstance();
        c.setTime(dateTime);
        c.add(Calendar.DATE, amount);
        return c.getTime();
	}
	
	/**
	 * 判断日期是否为同一天
	 * @param dateA
	 * @param dateB
	 * @return
	 */
	public static boolean areSameDay(Date dateA, Date dateB) {
	    Calendar calDateA = Calendar.getInstance();
	    calDateA.setTime(dateA);
	    Calendar calDateB = Calendar.getInstance();
	    calDateB.setTime(dateB);
	    return calDateA.get(Calendar.YEAR) == calDateB.get(Calendar.YEAR)
	            && calDateA.get(Calendar.MONTH) == calDateB.get(Calendar.MONTH)
	            &&  calDateA.get(Calendar.DAY_OF_MONTH) == calDateB.get(Calendar.DAY_OF_MONTH);
	}

	public static String getLongDate(Date aDate) {
		if (aDate == null)
			return "";
		SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		return formatter.format(aDate);
	}

	public static String getStrDate(Date aDate, String format) {
		if (aDate == null)
			return "";
		SimpleDateFormat formatter = new SimpleDateFormat(format);
		return formatter.format(aDate);
	}

	public static String shortDate(Date aDate) {
		return getStrDate(aDate, ONLY_DATE_FORMAT);
	}
	
	public static String getYMDDate(Date aDate){
		return getStrDate(aDate, YYYMMDD_WITH_SLASH_FORMAT);
	}
	
	/**
	 * 功能描述：日期加秒
	 * 
	 * @param date
	 *            Date 日期
	 * @param second
	 *            long 秒数
	 * @return 返回相加后的日期
	 */
	public static Date addDate(Date date, long second) {
		Calendar calendar = Calendar.getInstance();
		long millis = getMillis(date) + second * 1000;
		calendar.setTimeInMillis(millis);
		return calendar.getTime();
	}
	/**
	 * 功能描述：返回毫秒
	 * 
	 * @param date
	 *            日期
	 * @return 返回毫秒
	 */
	public static long getMillis(Date date) {
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(date);
		return calendar.getTimeInMillis();
	}
	/**
	 * 几天后
	 * @param date
	 * @param d 天数
	 * @return
	 */
	public static Date afterDate(Date date,int d){
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(date);
		calendar.set(Calendar.DATE, calendar.get(Calendar.DATE) + d);  
		return calendar.getTime();
	}
	
	/**
	 * 将指定Date加上或者减去n秒，加用n，减用-n
	 * @param date
	 * @param mm 需要计算的秒数
	 * @return
	 */
	public static Date calculatSeconds(Date date, int mm){
		Calendar cal = new GregorianCalendar();
		cal.setTime(date);
		cal.add(Calendar.SECOND, mm);
		return cal.getTime();
	}
	
	public static void main(String[] args) {
		System.out.println(DateUtil.shortDate(DateUtil.afterDate(new Date(), -8)));
		//System.out.println(DateUtil.parseDate("20090311161822", DateUtil.LONG_DATE_FORMAT2));
	}
}
