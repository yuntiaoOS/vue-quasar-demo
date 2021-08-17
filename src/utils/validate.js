/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

/**
 * @param {string} url
 * @returns {Boolean}
 */
export function validURL(url) {
  // const reg = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  // return reg.test(url)

    var strRegex = '^((https|http|ftp|rtsp|mms)?://)'
    + '?(([0-9a-z_!~*\'().&=+$%-]+: )?[0-9a-z_!~*\'().&=+$%-]+@)?' //ftp的user@ 
    + '(([0-9]{1,3}.){3}[0-9]{1,3}' // IP形式的URL- 199.194.52.184 
    + '|' // 允许IP和DOMAIN（域名） 
    + '([0-9a-z_!~*\'()-]+.)*' // 域名- www. 
    + '([0-9a-z][0-9a-z-]{0,61})?[0-9a-z].' // 二级域名 
    + '[a-z]{2,6})' // first level domain- .com or .museum 
    + '(:[0-9]{1,4})?' // 端口- :80 
    + '((/?)|' // a slash isn't required if there is no file name 
    + '(/[0-9a-z_!~*\'().;?:@&=+$,%#-]+)+/?)$';
  var re=new RegExp(strRegex);
  if (re.test(url)) {
    return (true);
  } else {
    return (false);
  }

}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

/**
 * @param {string} email
 * @returns {Boolean}
 */
export function validEmail(email) {
  const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return reg.test(email)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function isString(str) {
  if (typeof str === 'string' || str instanceof String) {
    return true
  }
  return false
}

/**
 * @param {Array} arg
 * @returns {Boolean}
 */
export function isArray(arg) {
  if (typeof Array.isArray === 'undefined') {
    return Object.prototype.toString.call(arg) === '[object Array]'
  }
  return Array.isArray(arg)
}


/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validID_CARD(val) {
  var b = "",
        c = "",
        d = {};
    /*身份证号长度校验*/
    if(!/(^\d{15}$)|(^\d{17}(\d|X|x)$)/.test(val)) {
        return {
            is: false,

            tip: "你输入的身份证长度或格式错误!"
 
        }
 
    };
    /*身份证号地址编码校验*/
    if(!/^11|12|13|14|15|21|22|23|31|32|33|34|35|36|37|41|42|43|44|45|46|50|51|52|53|54|61|62|63|64|65|71|81|82|91$/.test(val.substr(0, 2))) {
            return {
                is: false,
                tip: "你输入的身份证号地址编码错误!"
            }
       };
       /*15位身份证号转18位身份证号*/
    var a18 = val;
    if(val.length == '15') {
        var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
        var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
        var cardTemp = 0,
        i;
        a18 = ""
        a18 = val.substr(0, 6) + '19' + val.substr(6, val.length - 6);
        for(i = 0; i < 17; i++) {
            cardTemp += a18.substr(i, 1) * arrInt[i];
        }
        a18 += arrCh[cardTemp % 11];
    }
    /*获取身份证号中的年月日并校验*/
    var re_eighteen = /^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X|x)$/;
    var arr_data = a18.match(re_eighteen);
    var year = arr_data[2];
    var month = arr_data[3];
    var day = arr_data[4];
    var birthday = new Date(year + '/' + month + '/' + day);
    var now = new Date();
    var time = now.getFullYear() - year;
    /*校验年月日是否合理 */
    if(birthday.getFullYear() == year && (birthday.getMonth() + 1) == month && birthday.getDate() == day) {
        if(time >= 0 || time <= 130) {
            return {
                is: "true",
                tip: ""
            }
        }
    };
    return {
        is: false,
        tip: "你输入的身份证号出生年月日不合理!"
    }
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validPhoneNumber(str) {

  if (str.indexOf('-') !== -1  || str[0] === "0"){
    
    var reg=/^0\d{2,3}-?\d{7,8}$/
    return  reg.test(str)

  }else{

    var reg=11 && /^1[3456789]\d{9}$/
    return reg.test(str)

  }

  


  
}

/**
 * @param {string} value
 * @returns {string} 
 */
export function reTooltipMsg(value){
  if (!value) return ''
 const lineStringNum = 100
 var lineCount = 0
 lineCount = ((value.length/lineStringNum) > Math.floor((value.length/lineStringNum))) ? (Math.floor((value.length/lineStringNum)) + 1) : Math.floor((value.length/lineStringNum))
 var str = value.slice(0,lineStringNum)
 for (let i=0;i<lineCount;i++){
   if (i === 0){
      str = value.slice(lineStringNum*i,lineStringNum*(i+1)) + '<br>'
   }else if (i === (lineCount - 1)){
      str = str + value.slice(lineStringNum*i,value.length)
   }else{
      str = str + value.slice(lineStringNum*i,lineStringNum*(i+1)) + '<br>'
   }
 }
 return  str
               
}


/**
 * @param {string} str
 * @returns {Boolean}
 */
export function getBirthdayByIdCard(idCard) {
  var birthStr;

  if (15 == idCard.length) {

    birthStr = idCard.charAt(6) + idCard.charAt(7);

    if (parseInt(birthStr) < 10) {

        birthStr = '20' + birthStr;

    } else {

        birthStr = '19' + birthStr;

    }

    birthStr = birthStr + '-' + idCard.charAt(8) + idCard.charAt(9) + '-' + idCard.charAt(10) + idCard.charAt(11);

  } else if (18 == idCard.length) {

    birthStr = idCard.charAt(6) + idCard.charAt(7) + idCard.charAt(8) + idCard.charAt(9) + '-' + idCard.charAt(10) + idCard.charAt(11) + '-' + idCard.charAt(12) + idCard.charAt(13);

  }

  return birthStr;

}



/**
 * @param {string} idCard
 * @returns {Boolean}
 */
export function getSexByIdCard(idCard) {
  if (idCard.length === 15) {


    // let v = new Array();
    //     let vs = '10X98765432';
    //     v.push(2,4,8,5,10,9,7,3,6,1,2,4,8,5,10,9,7)
    //     let oldID = idCard
    //     let cardID17 = oldID.substring(0,6)+"19"+oldID.substring(6);
    //     let N = 0,R = -1,T = '0',j = 0,cardID18='';
        
    //     for (var i = 16;i >=0;i--){
    //       N += parseInt(cardID17.substring(i,i+1))*v[j];
    //       j++;
    //     }
    //     R = N % 11;
    //     T = vs.charAt(R)
    //     cardID18 = cardID17 + T;

    return (idCard.substring(14, 15) % 2).toString();

  } else if (idCard.length === 18) {

    return (idCard.substring(14, 17) % 2).toString();

  } else {

  //不是15或者18,null

  return '0';

  }
  
}