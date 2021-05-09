import React, { useEffect, useState } from 'react'
import {Row,Col,List,Avatar} from 'antd';
import Axios from 'axios';
import SideVideo from './Sections/SideVideo.js'
import Subscribe from './Sections/Subscribe.js'
import Comment from './Sections/Comment'
import LikeDislikes from './Sections/LikeDislikes';


function VideoDetailPage(props) {
    const videoId = props.match.params.videoId
    const [VideoDetail, setVideoDetail] = useState([])
    const [CommentLists, setCommentLists] = useState([])

    const videoVariable = {
        videoId: videoId
    }

    useEffect(() => {
        Axios.post('/api/video/getVideoDetail', videoVariable)
            .then(response => {
                if (response.data.success) {
                    console.log(response.data.VideoDetail)
                    setVideoDetail(response.data.VideoDetail)
                } else {
                    alert('Failed to get video Info')
                }
            })

        Axios.post('/api/comment/getComments', videoVariable)
            .then(response => {
                if (response.data.success) {
                    console.log('response.data.comments',response.data.comments)
                    setCommentLists(response.data.comments)
                } else {
                    alert('Failed to get video Info')
                }
            })


    }, [])

    const updateComment = (newComment) => {
        setCommentLists(CommentLists.concat(newComment))
    }

    if (VideoDetail.writer) {

    //const subscribeButton = VideoDetail.writer._id !== localStorage.getItem('userId') && <Subscribe userTo={VideoDetail.writer._id} userFrom={localStorage.getItem('userId')} />
    return (
        <Row>
            <Col lg={18} xs={24}>
                <div className="postPage" style={{ width: '100%', padding: '3rem 4em' }}>
                    <video style={{ width: '100%' }} src={`http://localhost:5000/${VideoDetail.filePath}`} controls></video>

                    <List.Item
                            actions={[<LikeDislikes video videoId={videoId} userId={localStorage.getItem('userId')}  />
                            ,<Subscribe userTo={VideoDetail.writer._id} userFrom={localStorage.getItem('userId')} />]}
                            >
                        <List.Item.Meta
                            avatar={<Avatar src={VideoDetail.writer && VideoDetail.writer.image} />}
                            title={<a href="https://ant.design">{VideoDetail.title}</a>}
                            description={VideoDetail.description}
                        />
                        <div></div>
                    </List.Item>
                    <Comment CommentLists={CommentLists} postId={VideoDetail._id} refreshFunction={updateComment}/>
                </div>
            </Col>
            <Col lg={6} xs={24}>
                <SideVideo/>
            </Col>
        </Row>
    )
    }else {
        return (
            <div>Loading...</div>
        )
    }

}

export default VideoDetailPage
