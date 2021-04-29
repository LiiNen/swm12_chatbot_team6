
export interface ApiError{
    code: string;
    message: string;
}

export interface User{
    /**
     * 멤버의 ID
     */
    id: string;
    /**
     * 멤버가 속한 워크스페이스의 ID
     */    
    space_id: string;
    /**
     * 멤버의 이름
     */
    name: string;
    /**
     * 멤버의 닉네임
     * @description 어드민이 닉네임을 사용하지 않도록 설정한 경우에 null이 반환
     */
    nickname?: string;
    /**
     * 멤버의 프로필 사진 URL
     */
    avatar_url?: string;
    /**
     * 부서명
     */
    department?: string;
    /**
     * 직급명
     * @description 어드민이 닉네임을 사용하지 않도록 설정한 경우에 null이 반환
     */
    position?: string;
    /**
     * 직책명
     * @description 어드민이 닉네임을 사용하지 않도록 설정한 경우에 null이 반환
     */
    responsibility?: string;
    /**
     * 전화번호 리스트
     */
    tels?: string[];
    /**
     * 모바일 번호 리스트
     */
    mobiles?: string[];
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


export interface Conversation {
    /**
     * 채팅방 ID
     */
    id:	string;
    /**
     * 채팅방의 종류를 구분
     * - 1:1 채팅방의 경우, dm 값으로 지정
     * - 그룹 채팅방의 경우, group 값으로 지정
     */
    type: string;	
    /**
     * 개설된 채팅방에 참여 중인 Bot과 멤버 수의 합
     */
    users_count: number;
    /**
     * 채팅방 이미지 URL
     * - 1:1 채팅방의 경우, 상대방의 프로필 이미지를 반환
     * - 그룹 채팅방의 경우, 대표 이미지 URL을 반환 
     */
    avatar_url?: string;
    /**
     * 채팅방의 이름
     * - 1:1 채팅방의 경우, 상대방의 이름을 반환
     * - 그룹 채팅방의 경우, 설정한 채팅방의 이름을 반환
     */
    name?: string	
}

export interface Message{
    /** 채팅 메시지 ID */
    id: string;
    /** 기본 텍스트 메시지 */
    text: string;
    /** 메시지를 전송한 멤버 ID */
    user_id: string;	
    /** 메시지가 작성된 채팅방 ID */
    conversation_id: string;	
    /** 메시지가 전송된 시각 */
    send_time:Date;	
    /** 메시지가 변경된 시각 */
    update_time:Date;
    /**
     * 블록 요소의 목록
     * - Block Kit 구성 및 정책 참고
     */
    blocks?:object[];
}