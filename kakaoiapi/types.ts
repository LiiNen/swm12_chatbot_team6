
export interface ApiError{
    code:string;
    message:string;
}

export interface User{
    /**
     * 멤버의 ID
     */
    id:string;
    /**
     * 멤버가 속한 워크스페이스의 ID
     */    
    space_id:string;
    /**
     * 멤버의 이름
     */
    name:string;
    /**
     * 멤버의 닉네임
     * @description 어드민이 닉네임을 사용하지 않도록 설정한 경우에 null이 반환
     */
    nickname?:string;
    /**
     * 멤버의 프로필 사진 URL
     */
    avatar_url?:string;
    /**
     * 부서명
     */
    department?:string;
    /**
     * 직급명
     * @description 어드민이 닉네임을 사용하지 않도록 설정한 경우에 null이 반환
     */
    position?:string;
    /**
     * 직책명
     * @description 어드민이 닉네임을 사용하지 않도록 설정한 경우에 null이 반환
     */
    responsibility?:string;
    /**
     * 전화번호 리스트
     */
    tels?:string[];
    /**
     * 모바일 번호 리스트
     */
    mobiles?:string[];
    /**
     * 근무 시작 시각
     */
    work_start_time?:Date; // it is unix time not sure is okay to use Date type
    /**
     * 근무 종료 시각
     */
    work_end_time?:Date;
    /**
     * 휴가 시작 시각
     */
    vacation_start_time?:Date;
    /**
     * 휴가 종료 시각
     */
     vacation_end_time?:Date;
}
