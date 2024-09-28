'use strict'

const { NotFoundError } = require('../core/error.response')
const Comment = require('../models/comment.model')
const { findProduct } = require('../models/repositories/product.repository')

/** key features: Comment service
 * add comment  [User, Shop]
 * get a list of comments   [User, Shop]
 * delete a comment [User, Shop, Admin]
 */
class CommentService {
    static async createComment({
        productId,
        userId,
        content,
        parentCommenId = null
    }) {
        const comment = new Comment({
            comment_productId: productId,
            comment_userId: userId,
            comment_content: content,
            comment_parentId: parentCommenId
        })

        let rightValue
        if (parentCommenId) {
            // reply comment
            const parentComment = await Comment.findById(parentCommenId)
            if(!parentComment) throw new NotFoundError('parent comment not found')
            rightValue = parentComment.comment_right
        
            // updateMany in Comments
            await Comment.updateMany({
                comment_productId: productId,
                comment_right: { $gte: rightValue }
            }, {
                $inc: { comment_right: 2 }
            })

            await Comment.updateMany({
                comment_productId: productId,
                comment_left: { $gte: rightValue }
            }, {
                $inc: { comment_left: 2 }
            })
        } else {
            const maxRightValue = await Comment.findOne(
                {comment_productId: productId},
                'comment_right',
                {sort: {comment_right: -1}}
            )
            if (maxRightValue) {
                rightValue = maxRightValue.right + 1
            } else {
                rightValue = 1
            }
        }

        // Insert to comment
        comment.comment_left = rightValue
        comment.comment_right = rightValue + 1


        await comment.save()
        return comment
    }

    static async getCommentsByParentId({
        productId,
        parentCommenId = null,
        litmit= 50,
        offset = 0  // skip
    }) {
        if(parentCommenId) {
            const parent = await Comment.findById(parentCommenId)
            if(!parent) throw new NotFoundError('Not found comment for product!')

            const comments = await Comment.find({
                comment_productId: productId,
                comment_left: { $gte : parent.comment_left },
                comment_right: { $lte: parent.comment_right }
            }).select({
                comment_left: 1,
                comment_right: 1,
                comment_content: 1,
                comment_parentId: 1
            }).sort({
                comment_left: 1
            })

            return comments
        }
        const comments = await Comment.find({
            comment_productId: productId,
            comment_parentId: parentCommenId
        }).select({
            comment_left: 1,
            comment_right: 1,
            comment_content: 1,
            comment_parentId: 1
        }).sort({
            comment_left: 1
        })

        return comments
    }

    static async deleteComments({commentId, productId}) {
        // check product exists in DB
        const foundProduct = await findProduct({
            product_id: productId
        })
        if(!foundProduct) throw new NotFoundError('product not found!')

        // 1. Xac dinh gia tri left va right of commentId
        const comment = await Comment.findById(commentId)
        if(!comment) throw new NotFoundError('Comment not found!')
        
        const leftValue = comment.comment_left
        const rightValue = comment.comment_right

        // 2. Tinh witd = right - left + 1
        const width = rightValue - leftValue + 1

        // 3. Xoa All CommentId con
        await Comment.deleteMany({
            comment_productId: productId,
            comment_left: {$gte: leftValue, $lte: rightValue}
        })

        // 4. Cap nhat gia tri left va right con lai
        await Comment.updateMany({
            comment_productId: productId,
            comment_right: { $gte: rightValue }
        }, {
            $inc: { comment_right: -width }
        })

        await Comment.updateMany({
            comment_productId: productId,
            comment_left: { $gte: rightValue }
        }, {
            $inc: { comment_left: -width }
        })

        /* SAI : vì ko update comment_right của parent
        await Comment.updateMany({
            comment_productId: productId,
            comment_left: { $gte: rightValue }
        }, {
            $inc: { comment_left: -width, comment_right: -width }
        })
        */
        return true
    }
}

module.exports = CommentService