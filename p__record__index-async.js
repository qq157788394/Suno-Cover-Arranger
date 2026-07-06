((typeof globalThis !== 'undefined' ? globalThis : self)["makoChunk_suno-cover-arranger"] = (typeof globalThis !== 'undefined' ? globalThis : self)["makoChunk_suno-cover-arranger"] || []).push([
        ['p__record__index'],
{ "src/hooks/usePromptRecords.ts": function (module, exports, __mako_require__){
"use strict";
__mako_require__.d(exports, "__esModule", {
    value: true
});
__mako_require__.d(exports, "usePromptRecords", {
    enumerable: true,
    get: function() {
        return usePromptRecords;
    }
});
var _interop_require_wildcard = __mako_require__("@swc/helpers/_/_interop_require_wildcard");
var _reactrefresh = /*#__PURE__*/ _interop_require_wildcard._(__mako_require__("node_modules/.pnpm/react-refresh@0.14.0/node_modules/react-refresh/runtime.js"));
var _react = __mako_require__("node_modules/.pnpm/react@19.2.7/node_modules/react/index.js");
var _db = __mako_require__("src/services/db.ts");
var prevRefreshReg;
var prevRefreshSig;
prevRefreshReg = self.$RefreshReg$;
prevRefreshSig = self.$RefreshSig$;
self.$RefreshReg$ = (type, id)=>{
    _reactrefresh.register(type, module.id + id);
};
self.$RefreshSig$ = _reactrefresh.createSignatureFunctionForTransform;
var _s = $RefreshSig$();
const usePromptRecords = (currentUserId)=>{
    _s();
    const [loading, setLoading] = (0, _react.useState)(false);
    const [records, setRecords] = (0, _react.useState)([]);
    // 获取所有记录
    const getAllRecords = (0, _react.useCallback)(async ()=>{
        return await _db.db.getUserPromptRecords(currentUserId);
    }, [
        currentUserId
    ]);
    // 日期范围筛选
    const filterByDateRange = (0, _react.useCallback)((records, dateRange)=>{
        if (!dateRange || !Array.isArray(dateRange) || !dateRange[0] || !dateRange[1]) return records;
        const startDate = new Date(dateRange[0]);
        const endDate = new Date(dateRange[1]);
        endDate.setHours(23, 59, 59, 999);
        return records.filter((record)=>{
            const recordDate = new Date(record.created_at || new Date(0));
            return recordDate >= startDate && recordDate <= endDate;
        });
    }, []);
    // 歌曲语言筛选
    const filterBySongLanguages = (0, _react.useCallback)((records, songLanguages)=>{
        if (!songLanguages) return records;
        const languages = Array.isArray(songLanguages) ? songLanguages : [
            songLanguages
        ];
        return records.filter((record)=>languages.includes(record.user_input.song_language));
    }, []);
    // 目标歌手筛选
    const filterByTargetSinger = (0, _react.useCallback)((records, targetSinger)=>{
        if (!(targetSinger === null || targetSinger === void 0 ? void 0 : targetSinger.trim())) return records;
        const lowerCaseTargetSinger = targetSinger.toLowerCase();
        return records.filter((record)=>{
            var _record_user_input_target_singer, _record_user_input;
            return (_record_user_input = record.user_input) === null || _record_user_input === void 0 ? void 0 : (_record_user_input_target_singer = _record_user_input.target_singer) === null || _record_user_input_target_singer === void 0 ? void 0 : _record_user_input_target_singer.toLowerCase().includes(lowerCaseTargetSinger);
        });
    }, []);
    // 风格描述筛选
    const filterByStyleDescription = (0, _react.useCallback)((records, styleDescription)=>{
        if (!(styleDescription === null || styleDescription === void 0 ? void 0 : styleDescription.trim())) return records;
        const lowerCaseStyleDescription = styleDescription.toLowerCase();
        return records.filter((record)=>{
            var _record_user_input_style_description, _record_user_input;
            return (_record_user_input = record.user_input) === null || _record_user_input === void 0 ? void 0 : (_record_user_input_style_description = _record_user_input.style_description) === null || _record_user_input_style_description === void 0 ? void 0 : _record_user_input_style_description.toLowerCase().includes(lowerCaseStyleDescription);
        });
    }, []);
    // 歌曲名称筛选
    const filterBySongName = (0, _react.useCallback)((records, songName)=>{
        if (!(songName === null || songName === void 0 ? void 0 : songName.trim())) return records;
        const lowerCaseSongName = songName.toLowerCase();
        return records.filter((record)=>{
            var _record_user_input_song_name, _record_user_input;
            return (_record_user_input = record.user_input) === null || _record_user_input === void 0 ? void 0 : (_record_user_input_song_name = _record_user_input.song_name) === null || _record_user_input_song_name === void 0 ? void 0 : _record_user_input_song_name.toLowerCase().includes(lowerCaseSongName);
        });
    }, []);
    // 关键词筛选
    const filterByKeyword = (0, _react.useCallback)((records, keyword)=>{
        if (!(keyword === null || keyword === void 0 ? void 0 : keyword.trim())) return records;
        const lowerCaseKeyword = keyword.toLowerCase();
        return records.filter((record)=>{
            var _record_user_input_song_name, _record_user_input, _record_user_input_target_singer, _record_user_input1, _record_user_input_style_description, _record_user_input2, _record_ai_result_styles, _record_ai_result, _record_ai_result_lyrics, _record_ai_result1;
            // 在歌曲名称、目标歌手、风格描述中搜索关键词
            return ((_record_user_input = record.user_input) === null || _record_user_input === void 0 ? void 0 : (_record_user_input_song_name = _record_user_input.song_name) === null || _record_user_input_song_name === void 0 ? void 0 : _record_user_input_song_name.toLowerCase().includes(lowerCaseKeyword)) || ((_record_user_input1 = record.user_input) === null || _record_user_input1 === void 0 ? void 0 : (_record_user_input_target_singer = _record_user_input1.target_singer) === null || _record_user_input_target_singer === void 0 ? void 0 : _record_user_input_target_singer.toLowerCase().includes(lowerCaseKeyword)) || ((_record_user_input2 = record.user_input) === null || _record_user_input2 === void 0 ? void 0 : (_record_user_input_style_description = _record_user_input2.style_description) === null || _record_user_input_style_description === void 0 ? void 0 : _record_user_input_style_description.toLowerCase().includes(lowerCaseKeyword)) || ((_record_ai_result = record.ai_result) === null || _record_ai_result === void 0 ? void 0 : (_record_ai_result_styles = _record_ai_result.styles) === null || _record_ai_result_styles === void 0 ? void 0 : _record_ai_result_styles.toLowerCase().includes(lowerCaseKeyword)) || ((_record_ai_result1 = record.ai_result) === null || _record_ai_result1 === void 0 ? void 0 : (_record_ai_result_lyrics = _record_ai_result1.lyrics) === null || _record_ai_result_lyrics === void 0 ? void 0 : _record_ai_result_lyrics.toLowerCase().includes(lowerCaseKeyword));
        });
    }, []);
    // 获取记录列表（整合筛选逻辑）
    const fetchRecords = (0, _react.useCallback)(async (filters = {})=>{
        setLoading(true);
        try {
            let fetchedRecords = await getAllRecords();
            // 应用所有筛选条件
            fetchedRecords = filterByKeyword(fetchedRecords, filters.keyword);
            fetchedRecords = filterByDateRange(fetchedRecords, filters.dateRange);
            fetchedRecords = filterBySongLanguages(fetchedRecords, filters.songLanguages);
            fetchedRecords = filterByTargetSinger(fetchedRecords, filters.targetSinger);
            fetchedRecords = filterByStyleDescription(fetchedRecords, filters.styleDescription);
            fetchedRecords = filterBySongName(fetchedRecords, filters.songName);
            setRecords(fetchedRecords);
            return fetchedRecords;
        } catch (error) {
            console.error('获取记录失败：', error);
            setRecords([]);
            return [];
        } finally{
            setLoading(false);
        }
    }, [
        getAllRecords,
        filterByKeyword,
        filterByDateRange,
        filterBySongLanguages,
        filterByTargetSinger,
        filterByStyleDescription,
        filterBySongName
    ]);
    // 删除单条记录
    const deleteRecord = (0, _react.useCallback)(async (recordId)=>{
        try {
            await _db.db.deletePromptRecord(recordId);
            // 刷新数据
            await fetchRecords();
            return {
                success: true
            };
        } catch (error) {
            console.error('删除记录失败：', error);
            return {
                success: false,
                error
            };
        }
    }, [
        fetchRecords
    ]);
    // 清空所有记录
    const clearAllRecords = (0, _react.useCallback)(async ()=>{
        try {
            const userRecords = await _db.db.getUserPromptRecords(currentUserId);
            await Promise.all(userRecords.map((record)=>{
                if (record.id) return _db.db.deletePromptRecord(record.id);
                return Promise.resolve();
            }));
            setRecords([]);
            return {
                success: true
            };
        } catch (error) {
            console.error('清空记录失败：', error);
            return {
                success: false,
                error
            };
        }
    }, [
        currentUserId
    ]);
    return {
        records,
        loading,
        fetchRecords,
        deleteRecord,
        clearAllRecords
    };
};
_s(usePromptRecords, "LxRREum03DG/GgWDrM2wUwCk3E8=");
if (prevRefreshReg) self.$RefreshReg$ = prevRefreshReg;
if (prevRefreshSig) self.$RefreshSig$ = prevRefreshSig;
function registerClassComponent(filename, moduleExports) {
    for(const key in moduleExports)try {
        if (key === "__esModule") continue;
        const exportValue = moduleExports[key];
        if (_reactrefresh.isLikelyComponentType(exportValue) && exportValue.prototype && exportValue.prototype.isReactComponent) _reactrefresh.register(exportValue, filename + " " + key);
    } catch (e) {}
}
function $RefreshIsReactComponentLike$(moduleExports) {
    if (_reactrefresh.isLikelyComponentType(moduleExports || moduleExports.default)) return true;
    for(var key in moduleExports)try {
        if (_reactrefresh.isLikelyComponentType(moduleExports[key])) return true;
    } catch (e) {}
    return false;
}
registerClassComponent(module.id, module.exports);
if ($RefreshIsReactComponentLike$(module.exports)) {
    module.meta.hot.accept();
    _reactrefresh.performReactRefresh();
}

},
"src/pages/record/index.tsx": function (module, exports, __mako_require__){
"use strict";
__mako_require__.d(exports, "__esModule", {
    value: true
});
__mako_require__.d(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
var _interop_require_wildcard = __mako_require__("@swc/helpers/_/_interop_require_wildcard");
var _reactrefresh = /*#__PURE__*/ _interop_require_wildcard._(__mako_require__("node_modules/.pnpm/react-refresh@0.14.0/node_modules/react-refresh/runtime.js"));
var _jsxdevruntime = __mako_require__("node_modules/.pnpm/react@19.2.7/node_modules/react/jsx-dev-runtime.js");
var _icons = __mako_require__("node_modules/.pnpm/@ant-design+icons@6.3.2_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@ant-design/icons/es/index.js");
var _procomponents = __mako_require__("node_modules/.pnpm/@ant-design+pro-components@2.8.10_antd@6.5.0_date-fns@2.0.0_moment@2.30.1_react-dom@19._39948e61760ff9ce55bb289fa3c0c022/node_modules/@ant-design/pro-components/es/index.js");
var _max = __mako_require__("src/.umi/exports.ts");
var _antd = __mako_require__("node_modules/.pnpm/antd@6.5.0_date-fns@2.0.0_moment@2.30.1_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/antd/es/index.js");
var _react = /*#__PURE__*/ _interop_require_wildcard._(__mako_require__("node_modules/.pnpm/react@19.2.7/node_modules/react/index.js"));
var _usePromptRecords = __mako_require__("src/hooks/usePromptRecords.ts");
var prevRefreshReg;
var prevRefreshSig;
prevRefreshReg = self.$RefreshReg$;
prevRefreshSig = self.$RefreshSig$;
self.$RefreshReg$ = (type, id)=>{
    _reactrefresh.register(type, module.id + id);
};
self.$RefreshSig$ = _reactrefresh.createSignatureFunctionForTransform;
var _s = $RefreshSig$();
// 结构化日志系统
const log = {
    info: (message, data)=>{
        console.log(`[INFO] ${new Date().toISOString()}: ${message}`, data || '');
    },
    warn: (message, data)=>{
        console.warn(`[WARN] ${new Date().toISOString()}: ${message}`, data || '');
    },
    error: (message, error)=>{
        console.error(`[ERROR] ${new Date().toISOString()}: ${message}`, error || '');
    },
    debug: (message, data)=>{
        console.debug(`[DEBUG] ${new Date().toISOString()}: ${message}`, data || '');
    }
};
const RecordPage = ()=>{
    _s();
    // 模拟当前用户ID，实际应用中应该从登录状态获取
    const currentUserId = 1;
    // 使用自定义 hook 管理提示词记录
    const { records, loading, fetchRecords, deleteRecord } = (0, _usePromptRecords.usePromptRecords)(currentUserId);
    // 使用Umi的useNavigate进行路由跳转
    const navigate = (0, _max.useNavigate)();
    // 组件挂载时获取初始数据
    (0, _react.useEffect)(()=>{
        fetchRecords();
    }, [
        fetchRecords
    ]);
    // 查看详情
    const handleViewDetail = (0, _react.useCallback)((record)=>{
        try {
            log.info('点击查看详情，准备传递的记录ID', {
                recordId: record.id,
                record
            });
            // 确保record对象存在且有ID
            if (!(record === null || record === void 0 ? void 0 : record.id)) {
                log.error('record或record.id为空', {
                    record
                });
                _antd.message.error('查看详情失败，记录数据不完整');
                return;
            }
            // 使用URL参数传递记录ID
            log.info('开始跳转到首页，携带记录ID参数', {
                recordId: record.id
            });
            navigate(`/?recordId=${record.id}`);
        } catch (error) {
            log.error('导航到详情页失败', error);
            _antd.message.error('查看详情失败，请稍后重试');
        }
    }, [
        navigate
    ]);
    // 删除单条记录
    const handleDelete = (0, _react.useCallback)(async (record)=>{
        _antd.Modal.confirm({
            title: '确认删除',
            content: '确定要删除这条记录吗？该操作无法恢复。',
            okText: '删除',
            okType: 'danger',
            cancelText: '取消',
            onOk: async ()=>{
                try {
                    if (!record.id) {
                        _antd.message.error('记录ID不存在');
                        return;
                    }
                    await deleteRecord(record.id);
                    _antd.message.success('删除成功');
                } catch (error) {
                    _antd.message.error('删除失败');
                    console.error('删除失败：', error);
                }
            }
        });
    }, [
        deleteRecord
    ]);
    // 处理搜索表单提交前的参数处理
    const beforeSearchSubmit = (0, _react.useCallback)((params)=>{
        // 直接返回处理后的参数，这些参数会传递给request函数
        return params;
    }, []);
    // 处理表格参数变化并获取数据
    const handleTableChange = (0, _react.useCallback)(async (_pagination, _filters, _sorter, extra)=>{
        // 从extra中获取搜索表单的参数
        const { action, searchFormValues } = extra;
        // 只有在搜索操作时才执行筛选
        if (action === 'search') {
            const keyword = (searchFormValues === null || searchFormValues === void 0 ? void 0 : searchFormValues.keyword) || '';
            const dateRange = searchFormValues === null || searchFormValues === void 0 ? void 0 : searchFormValues.created_at;
            const songLanguages = searchFormValues === null || searchFormValues === void 0 ? void 0 : searchFormValues.song_language;
            const targetSinger = searchFormValues === null || searchFormValues === void 0 ? void 0 : searchFormValues.target_singer;
            const styleDescription = searchFormValues === null || searchFormValues === void 0 ? void 0 : searchFormValues.style_description;
            const songName = searchFormValues === null || searchFormValues === void 0 ? void 0 : searchFormValues.song_name;
            await fetchRecords({
                keyword,
                dateRange,
                songLanguages,
                targetSinger,
                styleDescription,
                songName
            });
        }
    }, [
        fetchRecords
    ]);
    // 表格列配置
    const columns = (0, _react.useMemo)(()=>[
            {
                title: 'ID',
                dataIndex: 'id',
                key: 'id',
                width: 80,
                hideInSearch: true
            },
            {
                title: '时间',
                dataIndex: 'created_at',
                key: 'created_at',
                width: 180,
                valueType: 'dateRange',
                render: (_, record)=>{
                    const createdAt = record.created_at || new Date(0);
                    return /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_antd.Tooltip, {
                        title: new Date(createdAt).toLocaleString(),
                        children: /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_antd.Space, {
                            children: [
                                /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_icons.ClockCircleOutlined, {}, void 0, false, {
                                    fileName: "src/pages/record/index.tsx",
                                    lineNumber: 162,
                                    columnNumber: 17
                                }, this),
                                new Date(createdAt).toLocaleString()
                            ]
                        }, void 0, true, {
                            fileName: "src/pages/record/index.tsx",
                            lineNumber: 161,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "src/pages/record/index.tsx",
                        lineNumber: 160,
                        columnNumber: 13
                    }, this);
                }
            },
            {
                title: '歌曲名称',
                dataIndex: [
                    'user_input',
                    'song_name'
                ],
                key: 'song_name',
                width: 150,
                search: true,
                ellipsis: {
                    showTitle: false
                }
            },
            {
                title: '歌曲语言',
                dataIndex: [
                    'user_input',
                    'song_language'
                ],
                key: 'song_language',
                width: 120,
                valueType: 'select',
                valueEnum: {
                    Mandarin: {
                        text: '华语（普通话）'
                    },
                    Cantonese: {
                        text: '粤语'
                    },
                    Minnan: {
                        text: '闽南语'
                    },
                    English: {
                        text: '英语'
                    },
                    Korean: {
                        text: '韩语'
                    },
                    Japanese: {
                        text: '日语'
                    },
                    Other: {
                        text: '其他'
                    }
                },
                search: true,
                search: {
                    multiple: true,
                    fieldProps: {
                        mode: 'multiple',
                        options: [
                            {
                                value: 'Mandarin',
                                label: '华语（普通话）'
                            },
                            {
                                value: 'Cantonese',
                                label: '粤语'
                            },
                            {
                                value: 'Minnan',
                                label: '闽南语'
                            },
                            {
                                value: 'English',
                                label: '英语'
                            },
                            {
                                value: 'Korean',
                                label: '韩语'
                            },
                            {
                                value: 'Japanese',
                                label: '日语'
                            },
                            {
                                value: 'Other',
                                label: '其他'
                            }
                        ],
                        maxTagCount: 'responsive'
                    }
                }
            },
            {
                title: '模仿歌手',
                dataIndex: [
                    'user_input',
                    'target_singer'
                ],
                key: 'target_singer',
                width: 150,
                search: true,
                ellipsis: {
                    showTitle: false
                }
            },
            {
                title: '风格备注',
                dataIndex: [
                    'user_input',
                    'style_description'
                ],
                key: 'style_description',
                width: 200,
                search: true,
                ellipsis: {
                    showTitle: false
                }
            },
            {
                title: '操作',
                key: 'action',
                width: 120,
                fixed: 'right',
                hideInSearch: true,
                render: (_, record)=>/*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_antd.Space, {
                        size: "middle",
                        children: [
                            /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_antd.Tooltip, {
                                title: "查看提示词",
                                children: /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_antd.Button, {
                                    type: "primary",
                                    icon: /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_icons.EyeOutlined, {}, void 0, false, {
                                        fileName: "src/pages/record/index.tsx",
                                        lineNumber: 246,
                                        columnNumber: 23
                                    }, void 0),
                                    size: "small",
                                    onClick: ()=>handleViewDetail(record),
                                    children: "详情"
                                }, void 0, false, {
                                    fileName: "src/pages/record/index.tsx",
                                    lineNumber: 244,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "src/pages/record/index.tsx",
                                lineNumber: 243,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_antd.Tooltip, {
                                title: "删除",
                                children: /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_antd.Button, {
                                    danger: true,
                                    icon: /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_icons.DeleteOutlined, {}, void 0, false, {
                                        fileName: "src/pages/record/index.tsx",
                                        lineNumber: 256,
                                        columnNumber: 23
                                    }, void 0),
                                    size: "small",
                                    onClick: ()=>handleDelete(record),
                                    children: "删除"
                                }, void 0, false, {
                                    fileName: "src/pages/record/index.tsx",
                                    lineNumber: 254,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "src/pages/record/index.tsx",
                                lineNumber: 253,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "src/pages/record/index.tsx",
                        lineNumber: 242,
                        columnNumber: 11
                    }, this)
            }
        ], [
        handleViewDetail,
        handleDelete
    ]);
    return /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_procomponents.PageContainer, {
        children: [
            /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_antd.Alert, {
                title: "生成记录仅保存在本地设备，不会上传至服务器，更换设备或浏览器后记录将无法查看。",
                banner: true,
                style: {
                    marginBottom: 24
                }
            }, void 0, false, {
                fileName: "src/pages/record/index.tsx",
                lineNumber: 272,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_procomponents.ProTable, {
                rowKey: "id",
                columns: columns,
                // 直接使用records状态作为数据来源
                dataSource: records,
                loading: loading,
                headerTitle: "提示词生成记录",
                options: {
                    reload: ()=>fetchRecords(),
                    density: true,
                    fullScreen: true
                },
                scroll: {
                    x: 'max-content'
                },
                // 使用onChange处理表格参数变化
                onChange: handleTableChange,
                pagination: {
                    pageSize: 20,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total)=>`共 ${total} 条记录`
                },
                search: {
                    labelWidth: 'auto',
                    defaultCollapsed: false,
                    span: 6
                },
                // 添加request属性以确保表格能正确处理数据
                request: async (params, _sort, _filter)=>{
                    // 当表格首次加载或分页变化时也会调用此方法
                    // params包含了搜索表单的值
                    const keyword = (params === null || params === void 0 ? void 0 : params.keyword) || '';
                    const dateRange = params === null || params === void 0 ? void 0 : params.created_at;
                    const songLanguages = params === null || params === void 0 ? void 0 : params.song_language;
                    const targetSinger = params === null || params === void 0 ? void 0 : params.target_singer;
                    const styleDescription = params === null || params === void 0 ? void 0 : params.style_description;
                    const songName = params === null || params === void 0 ? void 0 : params.song_name;
                    await fetchRecords({
                        keyword,
                        dateRange,
                        songLanguages,
                        targetSinger,
                        styleDescription,
                        songName
                    });
                    return {
                        data: records,
                        success: true,
                        total: records.length
                    };
                },
                // 在搜索表单提交前处理参数
                beforeSearchSubmit: beforeSearchSubmit
            }, void 0, false, {
                fileName: "src/pages/record/index.tsx",
                lineNumber: 277,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "src/pages/record/index.tsx",
        lineNumber: 271,
        columnNumber: 5
    }, this);
};
_s(RecordPage, "Q1LVLtz+c6sOiHlq7cwW05gt+3U=", false, function() {
    return [
        _usePromptRecords.usePromptRecords,
        _max.useNavigate
    ];
});
_c = RecordPage;
var _default = /*#__PURE__*/ _c1 = _react.default.memo(RecordPage);
var _c;
var _c1;
$RefreshReg$(_c, "RecordPage");
$RefreshReg$(_c1, "%default%");
if (prevRefreshReg) self.$RefreshReg$ = prevRefreshReg;
if (prevRefreshSig) self.$RefreshSig$ = prevRefreshSig;
function registerClassComponent(filename, moduleExports) {
    for(const key in moduleExports)try {
        if (key === "__esModule") continue;
        const exportValue = moduleExports[key];
        if (_reactrefresh.isLikelyComponentType(exportValue) && exportValue.prototype && exportValue.prototype.isReactComponent) _reactrefresh.register(exportValue, filename + " " + key);
    } catch (e) {}
}
function $RefreshIsReactComponentLike$(moduleExports) {
    if (_reactrefresh.isLikelyComponentType(moduleExports || moduleExports.default)) return true;
    for(var key in moduleExports)try {
        if (_reactrefresh.isLikelyComponentType(moduleExports[key])) return true;
    } catch (e) {}
    return false;
}
registerClassComponent(module.id, module.exports);
if ($RefreshIsReactComponentLike$(module.exports)) {
    module.meta.hot.accept();
    _reactrefresh.performReactRefresh();
}

},
 }]);
//# sourceMappingURL=p__record__index-async.js.map