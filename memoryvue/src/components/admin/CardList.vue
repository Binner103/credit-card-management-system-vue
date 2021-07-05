<template>
    <div>信用卡列表
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>信用卡列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 信用卡列表主体 -->
        <el-card>
        <!-- 搜索区域 -->
        <el-row :gutter="25">
            <el-col :span="10">
            <el-input placeholder="请输入搜索内容" v-model="queryInfo.query" clearable @click="getCardList">
                <el-button slot="append" icon="el-icon-search" @click="getCardList"></el-button>
            </el-input>
            </el-col>
            <!-- 搜索按钮 -->
            <el-col :span="4">
            <el-button type="primary" @click="addDialogVisible = true">添加信用卡</el-button>
            </el-col>
        </el-row>
            <!-- 信用卡列表 -->
            <el-table :data="cardList" border stripe>
                <!-- 索引列 -->
                <el-table-column type="index"></el-table-column>
                <el-table-column label="信用卡号" prop="cardnumber"></el-table-column>
                <el-table-column label="开户行" prop="accbank"></el-table-column>
                <el-table-column label="还款日期" prop="repdate"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-tooltip effect="dark" content="修改" placement="top-start" :enterable="false">
                            <!-- 修改 -->
                            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
                        </el-tooltip>
                        <el-tooltip effect="dark" content="删除" placement="top-start" :enterable="false">
                            <!-- 删除 -->
                            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteCard(scope.row.id)"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页组件 size-change 每页最大变化 current-change 当前最大变化 layout功能组件 -->
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pageNum"
            :page-sizes="[1, 2, 5, 100]"
            :page-size="queryInfo.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            >
            </el-pagination>
        </el-card>

        <!-- 新增信用卡区域 -->
        <el-dialog title="添加信用卡" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
            <el-form :model="addForm" :rules="addFormRules" ref="addFormReff" label-width="70px">
                <el-form-item label="信用卡号" prop="cardnumber">
                    <el-input v-model="addForm.cardnumber"></el-input>
                </el-form-item>
                <el-form-item label="开户行" prop="accbank">
                    <el-input v-model="addForm.accbank"></el-input>
                </el-form-item>
                <el-form-item label="还款日期" prop="repdate">
                    <el-input v-model="addForm.repdate"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addCard">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    created(){
        this.getCardList();
    },
    data(){
        return {
            // 查询信息实体
                queryInfo: {
                query: "", // 查询信息
                pageNum: 1, // 当前页
                pageSize: 5, // 每页最大数
            },
            cardList:[],// 信用卡列表
            total:0,// 总记录数
            addDialogVisible: false,
            addForm:{
                cardnumber:'',
                accbank:'',
                repdate:'',
            },
            addFormRules: {
                cardnumber: [
                    { required: true, message: "请输入信用卡号", trigger: "blur" },
                    {
                        min: 5,
                        max: 20,
                        message: "长度在 5 到 20 个字符",
                        trigger: "blur",
                    },
                ],
                accbank: [
                    { required: true, message: "请输入开户行名称", trigger: "blur" },
                    {
                        min: 2,
                        max: 20,
                        message: "长度在 2 到 20 个字符",
                        trigger: "blur",
                    },
                ],
                repdate: [
                    { required: true, message: "请输入还款日期", trigger: "blur" },
                    {
                        min: 1,
                        max: 30,
                        message: "长度在 1 到 30 个字符",
                        trigger: "blur",
                    },
                ],
            },
        }
    },
    methods:{
        // 获取所有信用卡信息
        async getCardList(){
            const {data:cardres} = await this.$http.get("allcard",{params:this.queryInfo});
            this.cardList = cardres.data;
            this.total = cardres.cardCounts;
        },
        handleSizeChange(newSize){
            this.queryInfo.pageSize = newSize;
            this.getCardList();
        },
        handleCurrentChange(newPage){
            this.queryInfo.pageNum = newPage;
            this.getCardList();
        },
        addDialogClosed(){
            this.$refs.addFormReff.resetFields();
        },
        addCard(){
            this.$refs.addFormReff.validate(async valid =>{
                if(!valid) return;
                const {data:cardres} = await this.$http.post("addcard",this.addForm);
                if(cardres != "success"){
                    return this.$message.error("操作失败!!!");
                }
                this.$message.success("操作成功!!!");
                this.addDialogVisible = false;
                this.getCardList();
            });
        },
        async deleteCard(id){
            const confirmResult = await this.$confirm("此操作将永久删除信用卡信息,是否继续?","提示",{
                confirmButtonText:'确定',
                cancelButtonText:'取消',
                type:'warning',
            }).catch(err => err);
            if(confirmResult != 'confirm'){
                return this.$message.info("已经取消删除!");
            }
            const {data:cardres} = await this.$http.delete("deleteCard?id=" + id);
            if(cardres != "success"){
                return this.$message.error("删除失败!");
            }
            this.$message.success("删除成功!");
            this.getCardList();
        },
    }
}
</script>
<style lang='less' scoped>
.el-breadcrumb {
  margin-bottom: 15px;
  font-size: 15px;
}
</style>
