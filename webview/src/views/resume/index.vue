<script setup lang="ts">
import { defineComponent, shallowRef, reactive } from 'vue'
import { getZoomRatio } from '@/utils'
import renderHtml from './components/renderHtml.vue'

const resumeStyle = {
    zoom: getZoomRatio()
}
const html = `
    <div class="abc">
        <h1>Resume</h1>
        <p>My resume content</p>
    </div>
`

const dynamicTemplate = shallowRef()
const resumeData = reactive({
    personalInfo: { name: 'John Doe', email: 'john@example.com', phone: '123-456-7890' },
    summary: 'Experienced software developer...',
    education: [{ school: 'XYZ University', degree: 'Bachelor of Science', startDate: '2010', endDate: '2014' }],
    workExperience: [{ company: 'ABC Corp', role: 'Software Engineer', startDate: '2015', endDate: '2020', responsibilities: 'Developed web applications...' }],
    projectExperience: [{ projectName: 'Project A', description: 'Developed a web application...', startDate: '2018', endDate: '2019' }]
})

const generateTemplate = async () => {
    const vueTemplate = {
        template:
            '<div>\n  <div class="resume">\n    <header class="header">\n      <div class="profile-picture">\n        <img src="profile-picture.jpg" alt="Profile Picture" />\n      </div>\n      <div class="personal-info">\n        <h1>张三</h1>\n        <p>前端开发工程师</p>\n      </div>\n    </header>\n    <section class="summary">\n      <h2>个人总结</h2>\n      <p>具有丰富的前端开发经验，精通Vue.js和TypeScript，能够独立完成复杂项目的开发与优化。</p>\n    </section>\n    <section class="education">\n      <h2>教育背景</h2>\n      <div class="edu-item">\n        <h3>本科 - 某某大学</h3>\n        <p>2015年9月 - 2019年6月</p>\n      </div>\n      <div class="edu-item">\n        <h3>硕士 - 某某大学</h3>\n        <p>2019年9月 - 2021年6月</p>\n      </div>\n    </section>\n    <section class="work-experience">\n      <h2>工作经历</h2>\n      <div class="work-item">\n        <h3>前端开发工程师 - 某某公司</h3>\n        <p>2021年7月 - 至今</p>\n        <p>负责公司内部系统的开发与维护，优化前端性能，提升用户体验。</p>\n      </div>\n      <div class="work-item">\n        <h3>前端实习生 - 某某科技</h3>\n        <p>2020年6月 - 2021年6月</p>\n        <p>协助开发团队完成多个前端项目，参与需求分析和代码编写。</p>\n      </div>\n    </section>\n    <section class="projects">\n      <h2>项目经验</h2>\n      <div class="project-item">\n        <h3>项目一 - 项目描述</h3>\n        <p>2022年1月 - 2022年6月</p>\n        <p>使用Vue.js开发了一个企业管理系统，负责前端架构设计和功能实现。</p>\n      </div>\n      <div class="project-item">\n        <h3>项目二 - 项目描述</h3>\n        <p>2021年9月 - 2022年1月</p>\n        <p>开发了一个电商平台，负责前端页面的开发和优化。</p>\n      </div>\n      <div class="project-item">\n        <h3>项目三 - 项目描述</h3>\n        <p>2021年3月 - 2021年9月</p>\n        <p>完成了一个在线教育平台的前端开发，涉及复杂的用户交互和数据处理。</p>\n      </div>\n    </section>\n  </div>\n</div>',
        style: "<style>\n  .resume {\n    font-family: Arial, sans-serif;\n    color: #333;\n    line-height: 1.6;\n    padding: 20px;\n    background: url('background.svg') no-repeat center center;\n    background-size: cover;\n  }\n  .header {\n    display: flex;\n    align-items: center;\n    margin-bottom: 20px;\n  }\n  .profile-picture img {\n    border-radius: 50%;\n    width: 100px;\n    height: 100px;\n  }\n  .personal-info {\n    margin-left: 20px;\n  }\n  .personal-info h1 {\n    font-size: 24px;\n    margin: 0;\n  }\n  .personal-info p {\n    font-size: 18px;\n    color: #666;\n  }\n  h2 {\n    border-bottom: 2px solid #4a90e2;\n    padding-bottom: 5px;\n    margin-bottom: 15px;\n  }\n  .education, .work-experience, .projects {\n    margin-bottom: 20px;\n  }\n  .edu-item, .work-item, .project-item {\n    margin-bottom: 15px;\n  }\n  .edu-item h3, .work-item h3, .project-item h3 {\n    font-size: 20px;\n    margin: 0;\n  }\n  .edu-item p, .work-item p, .project-item p {\n    margin: 5px 0;\n  }\n  .edu-item p:first-of-type, .work-item p:first-of-type, .project-item p:first-of-type {\n    font-weight: bold;\n  }\n</style>"
    }

    dynamicTemplate.value = defineComponent({
        template: vueTemplate.template,
        props: ['resumeData'],
        setup(props) {
            // 使用 watchEffect 或 computed 进行数据绑定
            // 例如，如果 templateHtml 中有占位符，可以在这里进行替换
            const bindDataToTemplate = () => {
                // 实现数据绑定逻辑
            }

            bindDataToTemplate()

            return {
                bindDataToTemplate
            }
        },
        mounted() {
            const style = document.createElement('style')
            style.textContent = vueTemplate.style
            document.head.appendChild(style)
        }
    })
}
generateTemplate()
</script>

<template>
    <div class="resume_container" :style="resumeStyle">
        <component :is="dynamicTemplate" />
    </div>
</template>

<style scoped lang="scss">
.resume_container {
    width: 210mm;
    height: 297mm;
    padding: 15mm;
    border: 1px solid #000;
}
</style>
