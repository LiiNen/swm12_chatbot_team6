# -*- coding: utf-8 -*-

import json
import re
from datetime import datetime
from pytz import timezone
import requests
from apscheduler.schedulers.blocking import BlockingScheduler

from selenium import webdriver
from bs4 import BeautifulSoup
from selenium.webdriver.common.alert import Alert
from selenium.webdriver.chrome.options import Options

exec(open("secretaccount.py").read())

sched = BlockingScheduler()


@sched.scheduled_job('interval', seconds=300)
def my_crawler():

    # DRIVER_PATH = './chromedriver'
    # START_IDX = 72
    options = Options()
    options.add_argument("--headless")
    options.add_argument("--no-sandbox")

    driver = webdriver.Chrome(options=options)

    liinen_url = 'http://localhost:3000/api/v1/mentoring'
    headers = {'Content-type': 'application/json', 'Accept': 'text/plain'}
    print('crawl started at %s' % datetime.now(timezone('Asia/Seoul')))
    
    # LOG IN
    login_url = 'https://www.swmaestro.org/sw/member/user/forLogin.do?menuNo=200025'
    driver.get(login_url)

    driver.find_element_by_name('username').send_keys(username)
    driver.find_element_by_name('password').send_keys(password)
    driver.find_element_by_xpath(
        '//*[@id="login_form"]/div/div[1]/div/dl/dd/button').click()

    da = Alert(driver)
    da.accept()
    driver.implicitly_wait(3)

    base_url = 'https://www.swmaestro.org/sw/mypage/mentoLec/list.do?menuNo=200046'
    driver.get(base_url)
    html = driver.page_source
    soup = BeautifulSoup(html, 'html.parser')

    # 총 게시글 수 확인
    total_num = int(soup.find('strong', {'class': 'color-blue2'}).text)

    # 가장 마지막으로 크롤링했던 qudtnrSn 불러오기
    with open('latest.txt', "r") as f_read:
        latest = f_read.readline()

    # deleted 체크를 위한 current_list 생성
    current_list = []

    if total_num % 10:
        total_page = total_num // 10 + 1
    else:
        total_page = total_num // 10

    for i in range(1, total_page + 1):
        url = 'https://www.swmaestro.org/sw/mypage/mentoLec/list.do?menuNo=200046&pageIndex=%s' % i
        driver.get(url)
        html = driver.page_source
        soup = BeautifulSoup(html, 'html.parser')
        table = soup.find('table', {'class': 'tbl-st1 t'})
        posts = table.find_all('tr')
        for post in posts[1:]:
            div_a = post.find('div', {'class': 'rel'})
            a = div_a.find('a')['href']
            a = a[37:]
            qustnrSn = a[:-14]
            current_list.append(qustnrSn)

    with open('latest.txt', "w+") as file:
        file.write(current_list[0])

    for qudtnrSn in range(int(current_list[0]) - 30, int(current_list[0]) + 1):

        # qudtnrsn 기준 url
        post_url = 'https://www.swmaestro.org/sw/mypage/mentoLec/view.do?qustnrSn=%s&menuNo=200046' % qudtnrSn

        # deleted 체크
        if str(qudtnrSn) in current_list:
            deleted = False
        else:
            deleted = True

        # 각 글로 이동
        driver.get(post_url)

        html = driver.page_source
        soup = BeautifulSoup(html, 'html.parser')

        table_div = soup.find('div', {'class': 'bbs-view'})
        table_contents = soup.find_all('div', {'class': 'c'})
        content_div = table_div.find('div', {'class': 'cont'})
        applicant_div = soup.find('div', {'class': 'bbs-list bbs-application'})

        # 글 내용 크롤링
        contents = content_div.find_all()
        content = ''

        for cont in contents:
            content += cont.text
            content += '\n'

        # 글 제목 및 상태 크롤링
        title = table_contents[0].text
        status = table_contents[1].text
        if u'[마감]' in status:
            # print(u'[마감]')
            applyOpened = False
        else:
            # print(u'[모집중]')
            applyOpened = True

        # 지원날짜, 멘토링날짜, 멘토, 작성날짜 크롤링
        apply_date = table_contents[2].text
        applyStartDate = apply_date[:10]
        applyEndDate = apply_date[13:]
        eventStartTime = table_contents[3].text
        mentor = table_contents[5].text
        createdTime = table_contents[6].text

        # 참가자 크롤링
        applicants = []
        try:
            pageNum = len(applicant_div.find(
                'ul', {'class': 'pagination pagination-centered'}).find_all('li')) - 4

            applicantNum = applicant_div.find(
                'strong', {'class': 'color-blue2'}).text
            applicantNum = int(re.sub('명', '', applicantNum))

            for j in range(1, pageNum + 1):
                url = post_url + '&pageIndex=%s' % j
                driver.get(url)

                html = driver.page_source
                soup = BeautifulSoup(html, 'html.parser')
                applicant_div = soup.find(
                    'div', {'class': 'bbs-list bbs-application'})
                applicants_tr = applicant_div.find(
                    'table', {'class': 'tbl-st2'}).find_all('tr')

                for i in range(1, len(applicants_tr)):
                    applicants.append(
                        applicants_tr[i].find_all('td')[1].text)
        except Exception:
            applicantNum = 0

        temp = {'index': qudtnrSn, 'title': title,
                'applyStartDate': applyStartDate,
                'applyEndDate': applyEndDate, 'applyOpened': applyOpened,
                'deleted': deleted, 'applicants': applicants,
                'applicantNum': applicantNum, 'maxApplicantNum': None,
                'eventStartTime': eventStartTime, 'eventEndTime': None,
                'mentor': mentor, 'content': content,
                'createdTime': createdTime}
        # post_dict.append(temp)
        requests.post(liinen_url, data=json.dumps(temp), headers=headers)

    driver.implicitly_wait(3)
    driver.close()

    print('%s finished at %s' % (current_list[0], datetime.now(timezone('Asia/Seoul'))))

    driver.quit()


if __name__ == "__main__":

   sched.start()
   #my_crawler()