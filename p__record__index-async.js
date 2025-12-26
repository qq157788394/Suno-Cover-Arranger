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
var _reactrefresh = _interop_require_wildcard._(__mako_require__("node_modules/.pnpm/react-refresh@0.14.2/node_modules/react-refresh/runtime.js"));
var _react = __mako_require__("node_modules/.pnpm/react@19.2.3/node_modules/react/index.js");
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
    const getAllRecords = (0, _react.useCallback)(async ()=>{
        return await _db.db.getUserPromptRecords(currentUserId);
    }, [
        currentUserId
    ]);
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
    const filterBySongLanguages = (0, _react.useCallback)((records, songLanguages)=>{
        if (!songLanguages) return records;
        const languages = Array.isArray(songLanguages) ? songLanguages : [
            songLanguages
        ];
        return records.filter((record)=>languages.includes(record.user_input.song_language));
    }, []);
    const filterByTargetSinger = (0, _react.useCallback)((records, targetSinger)=>{
        if (!targetSinger || !targetSinger.trim()) return records;
        const lowerCaseTargetSinger = targetSinger.toLowerCase();
        return records.filter((record)=>{
            var _record_user_input_target_singer, _record_user_input;
            return (_record_user_input = record.user_input) === null || _record_user_input === void 0 ? void 0 : (_record_user_input_target_singer = _record_user_input.target_singer) === null || _record_user_input_target_singer === void 0 ? void 0 : _record_user_input_target_singer.toLowerCase().includes(lowerCaseTargetSinger);
        });
    }, []);
    const filterByStyleDescription = (0, _react.useCallback)((records, styleDescription)=>{
        if (!styleDescription || !styleDescription.trim()) return records;
        const lowerCaseStyleDescription = styleDescription.toLowerCase();
        return records.filter((record)=>{
            var _record_user_input_style_description, _record_user_input;
            return (_record_user_input = record.user_input) === null || _record_user_input === void 0 ? void 0 : (_record_user_input_style_description = _record_user_input.style_description) === null || _record_user_input_style_description === void 0 ? void 0 : _record_user_input_style_description.toLowerCase().includes(lowerCaseStyleDescription);
        });
    }, []);
    const filterBySongName = (0, _react.useCallback)((records, songName)=>{
        if (!songName || !songName.trim()) return records;
        const lowerCaseSongName = songName.toLowerCase();
        return records.filter((record)=>{
            var _record_user_input_song_name, _record_user_input;
            return (_record_user_input = record.user_input) === null || _record_user_input === void 0 ? void 0 : (_record_user_input_song_name = _record_user_input.song_name) === null || _record_user_input_song_name === void 0 ? void 0 : _record_user_input_song_name.toLowerCase().includes(lowerCaseSongName);
        });
    }, []);
    const filterByKeyword = (0, _react.useCallback)((records, keyword)=>{
        if (!keyword || !keyword.trim()) return records;
        const lowerCaseKeyword = keyword.toLowerCase();
        return records.filter((record)=>{
            var _record_user_input_song_name, _record_user_input, _record_user_input_target_singer, _record_user_input1, _record_user_input_style_description, _record_user_input2, _record_ai_result_styles, _record_ai_result, _record_ai_result_lyrics, _record_ai_result1;
            return ((_record_user_input = record.user_input) === null || _record_user_input === void 0 ? void 0 : (_record_user_input_song_name = _record_user_input.song_name) === null || _record_user_input_song_name === void 0 ? void 0 : _record_user_input_song_name.toLowerCase().includes(lowerCaseKeyword)) || ((_record_user_input1 = record.user_input) === null || _record_user_input1 === void 0 ? void 0 : (_record_user_input_target_singer = _record_user_input1.target_singer) === null || _record_user_input_target_singer === void 0 ? void 0 : _record_user_input_target_singer.toLowerCase().includes(lowerCaseKeyword)) || ((_record_user_input2 = record.user_input) === null || _record_user_input2 === void 0 ? void 0 : (_record_user_input_style_description = _record_user_input2.style_description) === null || _record_user_input_style_description === void 0 ? void 0 : _record_user_input_style_description.toLowerCase().includes(lowerCaseKeyword)) || ((_record_ai_result = record.ai_result) === null || _record_ai_result === void 0 ? void 0 : (_record_ai_result_styles = _record_ai_result.styles) === null || _record_ai_result_styles === void 0 ? void 0 : _record_ai_result_styles.toLowerCase().includes(lowerCaseKeyword)) || ((_record_ai_result1 = record.ai_result) === null || _record_ai_result1 === void 0 ? void 0 : (_record_ai_result_lyrics = _record_ai_result1.lyrics) === null || _record_ai_result_lyrics === void 0 ? void 0 : _record_ai_result_lyrics.toLowerCase().includes(lowerCaseKeyword));
        });
    }, []);
    const fetchRecords = (0, _react.useCallback)(async (filters = {})=>{
        setLoading(true);
        try {
            let fetchedRecords = await getAllRecords();
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
    const deleteRecord = (0, _react.useCallback)(async (recordId)=>{
        try {
            await _db.db.deletePromptRecord(recordId);
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
    const clearAllRecords = (0, _react.useCallback)(async ()=>{
        try {
            const userRecords = await _db.db.getUserPromptRecords(currentUserId);
            await Promise.all(userRecords.map((record)=>_db.db.deletePromptRecord(record.id)));
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
var _reactrefresh = _interop_require_wildcard._(__mako_require__("node_modules/.pnpm/react-refresh@0.14.2/node_modules/react-refresh/runtime.js"));
var _jsxdevruntime = __mako_require__("node_modules/.pnpm/react@19.2.3/node_modules/react/jsx-dev-runtime.js");
var _icons = __mako_require__("node_modules/.pnpm/@ant-design+icons@6.1.0_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/@ant-design/icons/es/index.js");
var _procomponents = __mako_require__("node_modules/.pnpm/@ant-design+pro-components@2.8.10_antd@6.1.1_date-fns@2.30.0_moment@2.30.1_react-dom@19_19f9ea8e0f5beeabfed55731f55ca46d/node_modules/@ant-design/pro-components/es/index.js");
var _max = __mako_require__("src/.umi/exports.ts");
var _antd = __mako_require__("node_modules/.pnpm/antd@6.1.1_date-fns@2.30.0_moment@2.30.1_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/antd/es/index.js");
var _react = _interop_require_wildcard._(__mako_require__("node_modules/.pnpm/react@19.2.3/node_modules/react/index.js"));
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
    const currentUserId = 1;
    const { records, loading, fetchRecords, deleteRecord } = (0, _usePromptRecords.usePromptRecords)(currentUserId);
    const navigate = (0, _max.useNavigate)();
    (0, _react.useEffect)(()=>{
        fetchRecords();
    }, [
        fetchRecords
    ]);
    const handleViewDetail = (0, _react.useCallback)((record)=>{
        try {
            log.info('点击查看详情，准备传递的记录ID', {
                recordId: record.id,
                record
            });
            if (!record || !record.id) {
                log.error('record或record.id为空', {
                    record
                });
                _antd.message.error('查看详情失败，记录数据不完整');
                return;
            }
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
    const handleDelete = (0, _react.useCallback)(async (record)=>{
        _antd.Modal.confirm({
            title: '确认删除',
            content: '确定要删除这条记录吗？该操作无法恢复。',
            okText: '删除',
            okType: 'danger',
            cancelText: '取消',
            onOk: async ()=>{
                try {
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
    const beforeSearchSubmit = (0, _react.useCallback)((params)=>{
        return params;
    }, []);
    const handleTableChange = (0, _react.useCallback)(async (pagination, filters, sorter, extra)=>{
        const { action, searchFormValues } = extra;
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
                    return (0, _jsxdevruntime.jsxDEV)(_antd.Tooltip, {
                        title: new Date(createdAt).toLocaleString(),
                        children: (0, _jsxdevruntime.jsxDEV)(_antd.Space, {
                            children: [
                                (0, _jsxdevruntime.jsxDEV)(_icons.ClockCircleOutlined, {}, void 0, false, {
                                    fileName: "src/pages/record/index.tsx",
                                    lineNumber: 158,
                                    columnNumber: 17
                                }, this),
                                new Date(createdAt).toLocaleString()
                            ]
                        }, void 0, true, {
                            fileName: "src/pages/record/index.tsx",
                            lineNumber: 157,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "src/pages/record/index.tsx",
                        lineNumber: 156,
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
                render: (_, record)=>(0, _jsxdevruntime.jsxDEV)(_antd.Space, {
                        size: "middle",
                        children: [
                            (0, _jsxdevruntime.jsxDEV)(_antd.Tooltip, {
                                title: "查看提示词",
                                children: (0, _jsxdevruntime.jsxDEV)(_antd.Button, {
                                    type: "primary",
                                    icon: (0, _jsxdevruntime.jsxDEV)(_icons.EyeOutlined, {}, void 0, false, {
                                        fileName: "src/pages/record/index.tsx",
                                        lineNumber: 242,
                                        columnNumber: 23
                                    }, void 0),
                                    size: "small",
                                    onClick: ()=>handleViewDetail(record),
                                    children: "详情"
                                }, void 0, false, {
                                    fileName: "src/pages/record/index.tsx",
                                    lineNumber: 240,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "src/pages/record/index.tsx",
                                lineNumber: 239,
                                columnNumber: 13
                            }, this),
                            (0, _jsxdevruntime.jsxDEV)(_antd.Tooltip, {
                                title: "删除",
                                children: (0, _jsxdevruntime.jsxDEV)(_antd.Button, {
                                    danger: true,
                                    icon: (0, _jsxdevruntime.jsxDEV)(_icons.DeleteOutlined, {}, void 0, false, {
                                        fileName: "src/pages/record/index.tsx",
                                        lineNumber: 252,
                                        columnNumber: 23
                                    }, void 0),
                                    size: "small",
                                    onClick: ()=>handleDelete(record),
                                    children: "删除"
                                }, void 0, false, {
                                    fileName: "src/pages/record/index.tsx",
                                    lineNumber: 250,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "src/pages/record/index.tsx",
                                lineNumber: 249,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "src/pages/record/index.tsx",
                        lineNumber: 238,
                        columnNumber: 11
                    }, this)
            }
        ], [
        handleViewDetail,
        handleDelete
    ]);
    return (0, _jsxdevruntime.jsxDEV)(_procomponents.PageContainer, {
        children: [
            (0, _jsxdevruntime.jsxDEV)(_antd.Alert, {
                title: "生成记录仅保存在本地设备，不会上传至服务器，更换设备或浏览器后记录将无法查看。",
                banner: true,
                style: {
                    marginBottom: 24
                }
            }, void 0, false, {
                fileName: "src/pages/record/index.tsx",
                lineNumber: 268,
                columnNumber: 7
            }, this),
            (0, _jsxdevruntime.jsxDEV)(_procomponents.ProTable, {
                rowKey: "id",
                columns: columns,
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
                onChange: handleTableChange,
                pagination: {
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total)=>`共 ${total} 条记录`
                },
                search: {
                    labelWidth: 'auto',
                    defaultCollapsed: false,
                    span: 6
                },
                request: async (params, sort, filter)=>{
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
                beforeSearchSubmit: beforeSearchSubmit
            }, void 0, false, {
                fileName: "src/pages/record/index.tsx",
                lineNumber: 273,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "src/pages/record/index.tsx",
        lineNumber: 267,
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
var _default = _c1 = _react.default.memo(RecordPage);
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