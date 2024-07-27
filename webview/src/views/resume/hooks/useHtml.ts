import { defineComponent, ref } from 'vue'

export enum ResumeModuleKeys {
    Personal = 'personal',
    Education = 'education',
    WorkExp = 'work_exp',
    ProjectExp = 'project_exp',
    Summary = 'summary',
    Other = 'other'
}

const resumeData = ref({
    personal: {
        type: ResumeModuleKeys.Personal,
        data: [
            {
                name: 'name',
                phone: 'phone',
                email: 'email',
                slaray: 'slaray',
                intention_job: 'intention_job',
                job_status: 'job_status',
                intention_city: 'intention_city',
                avatar: ''
            }
        ]
    },
    education: {
        type: ResumeModuleKeys.Education,
        data: [
            {
                school: 'school',
                degree: 'degree',
                college: 'college',
                major: 'major',
                city: 'city',
                start_date: 'start_date',
                end_date: 'end_date',
                desc: 'desc'
            }
        ]
    },
    work_exp: {
        type: ResumeModuleKeys.WorkExp,
        data: [
            {
                company: 'company',
                department: 'department',
                job: 'job',
                city: 'city',
                tags: ['tag1', 'tag2'],
                start_date: 'start_date',
                end_date: 'end_date',
                desc: 'desc'
            }
        ]
    },
    project_exp: {
        type: ResumeModuleKeys.ProjectExp,
        data: [
            {
                name: 'name',
                role: 'role',
                company: 'company',
                start_date: 'start_date',
                end_date: 'end_date',
                desc: 'desc'
            }
        ]
    },
    summary: {
        type: ResumeModuleKeys.Summary,
        data: [
            {
                desc: 'desc'
            }
        ]
    }
})

const resumeVue = {
    bg: {
        template: `
            <div class="resume-bg"></div>
        `,
        style: `
            .resume-bg {
                width: 100%;
                height: 100%;
            }
        `
    },
    personal: {
        template: `
            <div class="personal">
                <div class="avatar">
                    <slot name="avatar"></slot>
                </div>
                <div class="info">
                    <div class="name"><slot name="name"></slot></div>
                    <div class="list"><slot name="list"></slot></div>
                </div>
            </div>`,
        style: `
            .personal {
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 20px;
            }
            .avatar {
                width: 100px;
                height: 100px;
            }
            .name {
                font-size: 20px;
                font-weight: bold;
            }
        `
    },
    other: {
        template: `
            <div class="other">
                <div class="title"><slot name="title"></slot></div>
                <div class="content"><slot name="content"></slot></div>
            </div>
        `,
        style: ``
    }
}

console.log(JSON.stringify(resumeVue))

import resumeVueJson from './resumeVueJson.json'

export const useHtml = () => {
    const generateVueComponent = (tempAndStyle: { template: string; style: string }) => {
        const dynamicComponent = defineComponent({
            template: tempAndStyle.template,
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
                style.textContent = tempAndStyle.style
                document.head.appendChild(style)
            }
        })

        return dynamicComponent
    }

    const bgModule = (() => {
        const dynamicComponent = defineComponent({
            template: resumeVueJson.bg.template,
            props: ['resumeData'],
            setup(props) {},
            mounted() {
                const style = document.createElement('style')
                style.textContent = resumeVueJson.bg.style
                document.head.appendChild(style)
            }
        })

        return dynamicComponent
    })()

    const personalModule = (() => {
        const dynamicComponent = defineComponent({
            template: resumeVueJson.personal.template,
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
                style.textContent = resumeVueJson.personal.style
                document.head.appendChild(style)
            }
        })

        return dynamicComponent
    })()

    const otherModule = (() => {
        const dynamicComponent = defineComponent({
            template: resumeVueJson.other.template,
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
                style.textContent = resumeVueJson.other.style
                document.head.appendChild(style)
            }
        })

        return dynamicComponent
    })()

    return { resumeData, bgModule, personalModule, otherModule }
    
}
