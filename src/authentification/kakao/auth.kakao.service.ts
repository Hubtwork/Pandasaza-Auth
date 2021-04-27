
import { kakao_auth } from '../../utils/environments'

class KakaoAuthentificationService {


    private kakaoAuthURL = `https://kauth.kakao.com/oauth/authorize?client_id=${kakao_auth.key}&redirect_uri=${kakao_auth.redirectPath}&response_type=code`

    
}