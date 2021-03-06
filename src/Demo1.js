import React,{Component,Fragment} from 'react';
import axios from 'axios';
import {axiosWithToken} from '../../request/index'
import {connect} from "react-redux";
import {Link} from 'react-router-dom';
import {hostAddress} from '../../config';
import style from '../../css/style.module.css';
import ShowDialog from '../../common/utils/dialog';
import {LocalLogin,SessionLogin} from '../actions/Login';
import {startRegisterTimer,endRegisterTimer} from "../actions/RegisterTimer";
import MakeTimer from '../../common/utils/timer';
import OtherAuth from '../components/OtherAuth';
import {withRouter} from "react-router-dom";
const obserFunc = (str,callback)=>{
    const cb = (callback) =>{
        return '123'
    }
    window.addEventListener(str,cb)
    return window.removeEventListener(str,cb)
}

@connect(
    state=>({counter:state.registerTimer, info: state.info}),
    {startRegisterTimer,endRegisterTimer,LocalLogin,SessionLogin}
)
@withRouter
class Auth extends Component{
    constructor(props){
        super(props);
        this.state={
            login:false,
            telLogin:true,
            register:false,
            telphone:"",
            username:"",
            password:"",
            phoneNum:"",
            userName:"",
            registerPassword:"",
            verifyCode:"",
            verifyCodeLogin:"",
            hasVerified:false,
            hasRead:false,
            keepLogin:false
        };
    }

    doUpdateCheckAndTestPicture = ()=>{
        axios.post(hostAddress + "data/checkExTeReportByYear?idPatient="+this.props.info.idPatient);
    };

    componentWillMount() {
        if(this.props.location.search.substr(4)==='reg'){
            this.setState({login:false,register:true,telLogin:false});
        }
        if (this.props.staticContext) {
            this.props.staticContext.css.push(style._getCss())
        }
    }

    handleChange = (e) => {
        // console.log(e.target)
        let obj = {}
        obj[e.target.name] = e.target.value
        this.setState(obj)
    }

    handleClick = (e) => {
        const {username, password} = this.state
        console.log(username,password)
        axios.post('http://localhost:8080/login',{
            username,
            password
        })
            .then(res => {
                console.log(res)
                let result = res.data
                if (result.code) {
                    this.props.LocalLogin(result.data);
                    this.props.history.push('/')
                }
            })
    }

    viewHandler = (field, event) => {
        if (field === 'login') {
            this.setState({login: true, register: false, telLogin: false});
        } else if (field === 'register') {
            this.setState({login: false, register: true, telLogin: false});
        } else if (field === 'telLogin') {
            this.setState({login: false, register: false, telLogin: true});
        } else if (field === 'hasRead') {
            this.setState({hasRead: !this.state.hasRead});
        } else if (field === 'keepLogin') {
            this.setState({keepLogin: !this.state.keepLogin});
        } else {
            this.setState({[field]: event.target.value});
        }
    };

    loginHandler=()=>{
        axiosWithToken.post(hostAddress+"auth/patient/loginByUsername?username="+this.state.username+"&password="+this.state.password,{
            username:this.state.username,
            password:this.state.password
        }).then(res=>{
            console.log('loginHandler',res.data)
            if(res.data.code===200){
                if(this.state.keepLogin === true){
                    this.props.LocalLogin(res.data.result);
                }else{
                    this.props.SessionLogin(res.data.result);
                }
                this.doUpdateCheckAndTestPicture();
                // ShowDialog({description:"???????????????",confirm:()=>this.props.history.push("/")});
                //20210129 ???????????????
                this.props.history.push("/")
            }
            else{
                ShowDialog({description:"???????????????"+res.data.msg+" !"});
            }
        })
    };

    loginHandlerTel=()=>{
        axios.post(hostAddress+"auth/patient/loginByTel?telPatient="+this.state.phoneNum+"&verifycode="+this.state.verifyCodeLogin,{
            telPatient:this.state.phoneNum,
            verifycode:this.state.verifyCodeLogin
        }).then(res=>{
            if(res.data.code===200){
                if(this.state.keepLogin === true){
                    this.props.LocalLogin(res.data.result);
                }else{
                    this.props.SessionLogin(res.data.result);
                }
                this.doUpdateCheckAndTestPicture();
                // ShowDialog({description:"???????????????",confirm:()=>this.props.history.push("/")});
                //20210129 ???????????????
                this.props.history.push("/")
            }
            else{
                ShowDialog({description:"???????????????"+res.data.msg+" !"});
            }
        })
    };

    register=()=>{
        let passwordPattern=/^(?![A-Za-z]+$)(?![0-9]+$)(?![^a-zA-Z0-9]+$)\S{6,20}$/;
        let Name=/[0-9]{10}$/;
        if(passwordPattern.test(this.state.registerPassword)) {
            if(Name.test(this.state.userName)) {
                ShowDialog({description:"????????????????????????????????????"});
            }else{
                axios.post(hostAddress+"auth/patient/register",{
                    "password": this.state.registerPassword,
                    'telPatient':this.state.phoneNum,
                    'username':this.state.userName,
                    'verifycode':this.state.verifyCode
                }).then(res=>{
                    if(res.data.code===200){
                        ShowDialog({description:"?????????????????????????????????????????????????????????????????????????????????????????????????????????", confirmButton:"????????????",cancelButton:"????????????",confirm:()=>{this.setState({login:true,register:false});},cancel:()=>{this.props.history.push("/")}});
                    }
                    else{
                        ShowDialog({description:"????????????:"+res.data.msg+"!"});
                    }
                })

            }
        }else {
            ShowDialog({description:"?????????????????????????????????"});
        }
    };

    verifyCodeHandler=()=>{
        return ;
        if(this.props.counter!==60){
            return;
        }
        let pattern=/^1[0-9]{10}$/;
        if (pattern.test(this.state.phoneNum)) {
            axios.post(hostAddress + "auth/sendverifycode?phonenum=" + this.state.phoneNum, {
                "token": "cpshospit7al",
            }).then(response => {
                if (response.data.code === 200) {
                    ShowDialog({description: "????????????????????????????????????????????????"});
                    MakeTimer({run: this.props.startRegisterTimer, end: this.props.endRegisterTimer});
                    this.setState({hasVerified: true});
                } else {
                    ShowDialog({description: "????????????????????????"});
                }
            });
        }
        else{
            ShowDialog({description:"??????????????????????????????"});
        }
    };

    goBack=()=>{
        //console.log(document.referrer);
        // console.log(this.props.history);
        //console.log(aaa);
        //let url=document.referrer;
        //let url1=url.substring(url.length-13,url.length);
        // console.log(url1);
        //if(this.props.history.location.pathname!=="/login"){this.props.history.goBack();}
        // else {
        this.props.history.push("/");
        //}
        // window.history.go(-1);
    };

    //2021/1/28 ???????????????
    componentDidMount(){
        document.addEventListener("keydown", this.onKeyDown)
        document.addEventListener("key", this.verifyCodeHandler)
        window.addEventListener('test',() => {
            console.log('this is a test ')
        })
        obserFunc('load',()=>{console.log('123')})
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.onKeyDown)
        // document.removeEventListener("key", this.verifyCodeHandler)
        window.removeEventListener('test',() => {
            console.log('this is a test ')
        })
    }

    onKeyDown = (e) => {
        if(e.keyCode === 13){
            this.loginHandler()
        }
    }

    render() {
        return (
            <div className={style.login_body}>
                <div className={style.login_div_box}>
                    <div className={style.logo_login}>
                        <a href="#">
                            <img src={require("../../images/login-title.png")} alt=""/>
                        </a>
                    </div>
                    <div className={style.login_div}>
                        <div className={style.login_tab_box}>
                            <div className={style.hd}>
                                <em className={this.state.telLogin ? style.login + " " + style.on : style.login}
                                    style={{marginRight:"40px"}}
                                    onMouseEnter={this.viewHandler.bind(this, 'telLogin')}>???????????????</em>
                                <em className={this.state.login ? style.login + " " + style.on : style.login}
                                    onMouseEnter={this.viewHandler.bind(this, 'login')}>???????????????</em>
                                <em className={this.state.register ? style.register + " " + style.on : style.register}
                                    onMouseEnter={this.viewHandler.bind(this, 'register')}>????????????</em>
                            </div>
                            <div className={style.bd} style={{zIndex:0}}>
                                <ul className={this.state.register ? style.login_hide : style.login_input}>
                                    {this.state.login ? <Fragment>
                                        <div className={style.login_user}>
                                            <label>
                                                <i className={style.icon_user}></i>
                                            </label>
                                            <input className={style.input} type="text" name="username"
                                                   placeholder="?????????" value={this.state.username}
                                                // onChange={this.handleChange}
                                                   onChange={this.viewHandler.bind(this, 'username')}
                                            />
                                        </div>
                                        <div className={style.login_user}>
                                            <label>
                                                <i className={style.icon_password}></i>
                                            </label>
                                            <input className={style.input} type="password" name="password" id=""
                                                   placeholder="??????"
                                                   onChange={this.viewHandler.bind(this, 'password')}
                                                // onChange={this.handleChange}
                                            />
                                        </div>
                                        <div className={style.login_btn}>
                                            <input type="button" name="" id="tenxunPatientLogin"
                                                   disabled={!(this.state.password && this.state.username)}
                                                   onClick={this.loginHandler.bind(this)}
                                                   value="??????"
                                                // onClick={this.handleClick}

                                            />
                                        </div>
                                    </Fragment> : <Fragment>
                                        <div className={style.login_user}>
                                            <label>
                                                <i className={style.icon_user}></i>
                                            </label>
                                            <input className={style.input} type="text" name=""
                                                   placeholder="?????????" value={this.state.phoneNum}
                                                   onChange={this.viewHandler.bind(this, 'phoneNum')}
                                            />
                                        </div>
                                        <div className={style.login_user}>
                                            <label>
                                                <i className={style.icon_password}></i>
                                            </label>
                                            <input className={style.input} type="text" name="" placeholder="?????????"
                                                   style={{width: '120px'}}
                                                   onChange={this.viewHandler.bind(this, 'verifyCodeLogin')}
                                            />
                                            <a className={style.code_telp} href="#"
                                               onClick={this.verifyCodeHandler.bind(this)}
                                               style={this.props.counter === 60 ? {} : {background: "#666666"}}>
                                                {this.props.counter === 60 ? "?????????????????????" : "????????????(" + this.props.counter + "s)"}
                                            </a>
                                        </div>
                                        <div className={style.login_btn}>
                                            <input type="button" name="" id="tenxunPatientLogin"
                                                   disabled={!(this.state.verifyCodeLogin && this.state.phoneNum)}
                                                   onClick={this.loginHandlerTel.bind(this)} value="??????"/>
                                        </div>
                                    </Fragment>
                                    }
                                    <div className={style.login_auto}>
                                        <ul className={style.checkbox}>
                                            <input type="checkbox" name="" id="" value={this.state.keepLogin} onChange={this.viewHandler.bind(this,"keepLogin")}/>
                                            <span>??????????????????</span>
                                        </ul>
                                        <ul className={style.checkbox}
                                            style={{cursor: "pointer",paddingLeft:'30px'}}>
                                            {/*style={this.props.history.location.pathname!=="/login"?*/}
                                            {/*{cursor: "pointer",paddingLeft:'30px'}:{display:"none"}}>*/}
                                            <span onClick={this.goBack.bind(this)}>??????</span>
                                        </ul>
                                        <ul className={style.forget_pwd}>
                                            <Link to="/resetPassword">???????????????</Link>
                                        </ul>
                                    </div>
                                </ul>
                                <ul className={this.state.register ? style.login_input : style.login_hide}>
                                    <div className={style.login_user}>
                                        <input className={style.reg_input} name="" placeholder="????????????"
                                               onChange={this.viewHandler.bind(this, 'phoneNum')}/>
                                    </div>
                                    <div className={style.login_user}>
                                        <input className={style.code_num} type="text" name="" placeholder="???????????????"
                                               onChange={this.viewHandler.bind(this, 'verifyCode')}/>
                                        <a className={style.code_telp} href="#"
                                           onClick={this.verifyCodeHandler.bind(this)}
                                           style={this.props.counter===60?{}:{background:"#666666"}}>
                                            {this.props.counter===60?"?????????????????????":"????????????("+this.props.counter+"s)"}
                                        </a>
                                    </div>

                                    <div className={style.login_user}>
                                        <input className={style.reg_input} type="password" name=""
                                               placeholder="6-20??????????????????/??????/????????????2???"
                                               onChange={this.viewHandler.bind(this, 'registerPassword')}
                                        />
                                    </div>
                                    <div className={style.login_user} style={{marginBottom:'10px'}}>
                                        <input className={style.reg_input} type="userName" name=""
                                               placeholder="?????????????????????11????????????"
                                               onChange={this.viewHandler.bind(this, 'userName')}
                                        />
                                    </div>
                                    <div className={style.login_auto}>
                                        <ul className={style.checkbox}>
                                            <input type="checkbox" name="" value="" onChange={this.viewHandler.bind(this,"hasRead")}
                                            />
                                            <p>?????????????????????<b>??????????????????</b></p>
                                        </ul>
                                    </div>
                                    <div className={style.login_btn + " " + style.login_top} style={{marginBottom:'10px',marginTop:'5px'}}>
                                        <input type="button" name="" value="??????" style={this.state.verifyCode&&this.state.hasRead&&this.state.userName&&this.state.registerPassword?{}:{background:"#666666"}}
                                               disabled={!(this.state.hasRead&&this.state.verifyCode&&this.state.userName&&this.state.registerPassword)}
                                               onClick={this.register.bind(this)}
                                        />
                                    </div>
                                </ul>
                            </div>
                        </div>
                        <OtherAuth/>
                    </div>
                </div>
            </div>
        )
    }
}

export default Auth;
