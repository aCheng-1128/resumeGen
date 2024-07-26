import fs from 'fs'
import path from 'path'
import type { Plugin } from 'vite'
import { debounce } from 'lodash-unified'
import matter from 'gray-matter'

export const dynamicJsonPlugin = ({ folderPath, outputPath, outputFilename }: { folderPath: string; outputPath: string; outputFilename: string }): Plugin => {
    // console.log('folderPath:', folderPath)
    // console.log('outputPath:', outputPath)
    // console.log('outputFilename:', outputFilename)

    // 递归读取文件夹内容
    const readDirectory = (dir: string): any[] => {
        return fs.readdirSync(dir).flatMap((item) => {
            const fullPath = path.resolve(dir, item)
            const stat = fs.statSync(fullPath)
            if (stat.isDirectory()) {
                return readDirectory(fullPath) // 如果是文件夹，递归读取
            } else {
                const fileContent = fs.readFileSync(fullPath, 'utf-8')
                const parsedData = matter(fileContent)
                //这个就是md文件的头部信息 解析yaml出来的json文件
                const headData = parsedData.data
                return [
                    {
                        filePath: path.relative(folderPath, fullPath),
                        data: headData,
                        //父级文件夹的名称
                        parentFolder: path.basename(path.dirname(fullPath)),
                        // 文件名字
                        filename: path.basename(fullPath, path.extname(fullPath))
                    }
                ]
            }
        })
    }

    const generateJson = () => {
        if (!fs.existsSync(folderPath)) {
            throw new Error(`Folder ${folderPath} does not exist.`)
        }

        const originJson = readDirectory(folderPath)
        // const json =  handleJson(originJson)
        // 按照文件的1. 2. 排序
        const json = originJson.sort((a, b) => {
            // const filename = item.filename
            // const index = filename.split('.')[0] || 0;
            // return index
            // return a.filename.localeCompare(b.filename)
            const aIndex = Number(a.filename.split('.')[0] || 0)
            const bIndex = Number(b.filename.split('.')[0] || 0)
            return aIndex - bIndex
        })

        const writeStr = JSON.stringify(json, null, 4).trim().replace(/\n/g, '\r\n') + '\r\n'

        fs.writeFileSync(path.resolve(outputPath, outputFilename), writeStr, 'utf-8')
    }

    return {
        name: 'dynamic-json-plugin',
        configResolved(resolvedConfig) {
            // config = resolvedConfig
        },
        buildStart() {
            generateJson()

            // // 监听文件夹变化
            // fs.watch(folderPath, { recursive: true }, (event, filename) => {
            //     console.log(`File ${filename} has been changed, updating JSON...`)
            //     generateJson()
            // })
        }
    }
}
