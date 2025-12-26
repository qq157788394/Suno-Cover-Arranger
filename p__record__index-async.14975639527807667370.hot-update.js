globalThis.makoModuleHotUpdate('p__record__index', {
    modules: {
        "src/pages/changelog/index.tsx": function(module, exports, __mako_require__) {
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
            var _procomponents = __mako_require__("node_modules/.pnpm/@ant-design+pro-components@2.8.10_antd@6.1.1_date-fns@2.30.0_moment@2.30.1_react-dom@19_19f9ea8e0f5beeabfed55731f55ca46d/node_modules/@ant-design/pro-components/es/index.js");
            var _xmarkdown = __mako_require__("node_modules/.pnpm/@ant-design+x-markdown@2.1.1_@types+react@19.2.7_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/@ant-design/x-markdown/es/index.js");
            var _max = __mako_require__("src/.umi/exports.ts");
            var _antd = __mako_require__("node_modules/.pnpm/antd@6.1.1_date-fns@2.30.0_moment@2.30.1_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/antd/es/index.js");
            var _react = _interop_require_wildcard._(__mako_require__("node_modules/.pnpm/react@19.2.3/node_modules/react/index.js"));
            "";
            "";
            var prevRefreshReg;
            var prevRefreshSig;
            prevRefreshReg = self.$RefreshReg$;
            prevRefreshSig = self.$RefreshSig$;
            self.$RefreshReg$ = (type, id)=>{
                _reactrefresh.register(type, module.id + id);
            };
            self.$RefreshSig$ = _reactrefresh.createSignatureFunctionForTransform;
            var _s = $RefreshSig$();
            const ChangelogPage = ()=>{
                var _initialState_settings;
                _s();
                const [changelogContent, setChangelogContent] = (0, _react.useState)('');
                const [loading, setLoading] = (0, _react.useState)(true);
                const { initialState } = (0, _max.useModel)('@@initialState');
                const isDarkTheme = (initialState === null || initialState === void 0 ? void 0 : (_initialState_settings = initialState.settings) === null || _initialState_settings === void 0 ? void 0 : _initialState_settings.navTheme) === 'realDark';
                const markdownThemeClass = isDarkTheme ? 'x-markdown-dark' : 'x-markdown-light';
                (0, _react.useEffect)(()=>{
                    var response, content;
                    {
                        const fetchChangelog = async ()=>{
                            try {
                                const response = await fetch('/api/changelog');
                                if (response.ok) {
                                    const content = await response.text();
                                    setChangelogContent(content);
                                } else {
                                    console.error('Failed to fetch changelog.md');
                                    setChangelogContent('# 更新记录\n\n暂无更新记录，请稍后查看。');
                                }
                            } catch (error) {
                                console.error('Error fetching changelog.md:', error);
                                setChangelogContent('# 更新记录\n\n暂无更新记录，请稍后查看。');
                            } finally{
                                setLoading(false);
                            }
                        };
                        fetchChangelog();
                    }
                }, []);
                return (0, _jsxdevruntime.jsxDEV)(_procomponents.PageContainer, {
                    title: "更新记录",
                    children: (0, _jsxdevruntime.jsxDEV)(_antd.Card, {
                        children: loading ? (0, _jsxdevruntime.jsxDEV)("div", {
                            style: {
                                textAlign: 'center',
                                padding: '40px'
                            },
                            children: (0, _jsxdevruntime.jsxDEV)(_antd.Spin, {
                                size: "large"
                            }, void 0, false, {
                                fileName: "src/pages/changelog/index.tsx",
                                lineNumber: 75,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "src/pages/changelog/index.tsx",
                            lineNumber: 74,
                            columnNumber: 11
                        }, this) : (0, _jsxdevruntime.jsxDEV)(_xmarkdown.XMarkdown, {
                            className: markdownThemeClass,
                            children: changelogContent
                        }, void 0, false, {
                            fileName: "src/pages/changelog/index.tsx",
                            lineNumber: 78,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "src/pages/changelog/index.tsx",
                        lineNumber: 72,
                        columnNumber: 7
                    }, this)
                }, void 0, false, {
                    fileName: "src/pages/changelog/index.tsx",
                    lineNumber: 71,
                    columnNumber: 5
                }, this);
            };
            _s(ChangelogPage, "hiyVDiVFVzzs8fZjaRxu9VZLr90=", false, function() {
                return [
                    _max.useModel
                ];
            });
            _c = ChangelogPage;
            var _default = ChangelogPage;
            var _c;
            $RefreshReg$(_c, "ChangelogPage");
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
        "src/pages/record/index.tsx": function(module, exports, __mako_require__) {
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
        "src/services/db.ts": function(module, exports, __mako_require__) {
            "use strict";
            __mako_require__.d(exports, "__esModule", {
                value: true
            });
            function _export(target, all) {
                for(var name in all)Object.defineProperty(target, name, {
                    enumerable: true,
                    get: all[name]
                });
            }
            __mako_require__.e(exports, {
                db: function() {
                    return db;
                },
                default: function() {
                    return _default;
                }
            });
            var _interop_require_default = __mako_require__("@swc/helpers/_/_interop_require_default");
            var _interop_require_wildcard = __mako_require__("@swc/helpers/_/_interop_require_wildcard");
            var _reactrefresh = _interop_require_wildcard._(__mako_require__("node_modules/.pnpm/react-refresh@0.14.2/node_modules/react-refresh/runtime.js"));
            var _dexie = _interop_require_default._(__mako_require__("node_modules/.pnpm/dexie@4.2.1/node_modules/dexie/import-wrapper.mjs"));
            var prevRefreshReg;
            var prevRefreshSig;
            prevRefreshReg = self.$RefreshReg$;
            prevRefreshSig = self.$RefreshSig$;
            self.$RefreshReg$ = (type, id)=>{
                _reactrefresh.register(type, module.id + id);
            };
            self.$RefreshSig$ = _reactrefresh.createSignatureFunctionForTransform;
            class AppDatabase extends _dexie.default {
                users;
                projects;
                styleConfigs;
                promptRecords;
                apiKeys;
                constructor(){
                    super('SunoCoverArrangerDB');
                    this.version(1).stores({
                        users: '++id, name, email, created_at',
                        projects: '++id, title, user_id, created_at, updated_at',
                        styleConfigs: '++id, name, user_id, is_default, created_at, updated_at',
                        promptRecords: '++id, user_id, created_at',
                        apiKeys: '++id, user_id, api_key, model, is_current, created_at'
                    });
                    this.version(2).stores({
                        promptRecords: '++id, userId, createdAt'
                    });
                    this.version(3).stores({
                        users: '++id, name, email, created_at',
                        projects: '++id, title, user_id, created_at, updated_at',
                        styleConfigs: '++id, name, user_id, is_default, created_at, updated_at',
                        promptRecords: '++id, user_id, created_at',
                        apiKeys: '++id, user_id, api_key, model, is_current, created_at'
                    }).upgrade(async (tx)=>{
                        console.log('数据库升级到版本3，重新创建表结构');
                    });
                    this.version(4).stores({
                        users: '++id, name, email, created_at',
                        projects: '++id, title, user_id, created_at, updated_at',
                        styleConfigs: '++id, name, user_id, is_default, created_at, updated_at',
                        promptRecords: '++id, user_id, created_at',
                        apiKeys: '++id, user_id, api_key, model, is_current, created_at'
                    }).upgrade(async (tx)=>{
                        console.log('数据库升级到版本4，统一字段命名规范为snake_case');
                    });
                    this.users = this.table('users');
                    this.projects = this.table('projects');
                    this.styleConfigs = this.table('styleConfigs');
                    this.promptRecords = this.table('promptRecords');
                    this.apiKeys = this.table('apiKeys');
                }
                async createUser(user) {
                    const newUser = {
                        ...user,
                        createdAt: new Date()
                    };
                    const id = await this.users.add(newUser);
                    return {
                        ...newUser,
                        id
                    };
                }
                async getUser(id) {
                    return this.users.get(id);
                }
                async updateUser(id, updates) {
                    return this.users.update(id, updates);
                }
                async deleteUser(id) {
                    await this.users.delete(id);
                }
                async getAllUsers() {
                    return this.users.toArray();
                }
                async createProject(project) {
                    const now = new Date();
                    const newProject = {
                        ...project,
                        createdAt: now,
                        updatedAt: now
                    };
                    const id = await this.projects.add(newProject);
                    return {
                        ...newProject,
                        id
                    };
                }
                async getProject(id) {
                    return this.projects.get(id);
                }
                async updateProject(id, updates) {
                    return this.projects.update(id, {
                        ...updates,
                        updatedAt: new Date()
                    });
                }
                async deleteProject(id) {
                    await this.projects.delete(id);
                }
                async getUserProjects(userId) {
                    return this.projects.where('userId').equals(userId).toArray();
                }
                async createStyleConfig(config) {
                    const now = new Date();
                    const newConfig = {
                        ...config,
                        createdAt: now,
                        updatedAt: now
                    };
                    if (newConfig.isDefault) await this.styleConfigs.where({
                        userId: newConfig.userId,
                        isDefault: true
                    }).modify({
                        isDefault: false,
                        updatedAt: now
                    });
                    const id = await this.styleConfigs.add(newConfig);
                    return {
                        ...newConfig,
                        id
                    };
                }
                async getStyleConfig(id) {
                    return this.styleConfigs.get(id);
                }
                async updateStyleConfig(id, updates) {
                    const now = new Date();
                    if (updates.isDefault) {
                        const config = await this.styleConfigs.get(id);
                        if (config) await this.styleConfigs.where({
                            userId: config.userId,
                            isDefault: true
                        }).modify({
                            isDefault: false,
                            updatedAt: now
                        });
                    }
                    return this.styleConfigs.update(id, {
                        ...updates,
                        updatedAt: now
                    });
                }
                async deleteStyleConfig(id) {
                    await this.styleConfigs.delete(id);
                }
                async getUserStyleConfigs(userId) {
                    return this.styleConfigs.where('userId').equals(userId).toArray();
                }
                async getDefaultStyleConfig(userId) {
                    return this.styleConfigs.where({
                        userId,
                        isDefault: true
                    }).first();
                }
                async createPromptRecord(record) {
                    const newRecord = {
                        ...record,
                        created_at: new Date()
                    };
                    const id = await this.promptRecords.add(newRecord);
                    return {
                        ...newRecord,
                        id
                    };
                }
                async getPromptRecord(id) {
                    return this.promptRecords.get(id);
                }
                async updatePromptRecord(id, updates) {
                    return this.promptRecords.update(id, updates);
                }
                async deletePromptRecord(id) {
                    await this.promptRecords.delete(id);
                }
                async getUserPromptRecords(user_id, limit) {
                    const query = this.promptRecords.where('user_id').equals(user_id).sortBy('created_at').then((records)=>records.reverse());
                    if (limit) return (await query).slice(0, limit);
                    return query;
                }
                async searchPromptRecords(user_id, keyword, limit) {
                    const allRecords = await this.getUserPromptRecords(user_id);
                    const filteredRecords = allRecords.filter((record)=>{
                        const searchText = JSON.stringify(record).toLowerCase();
                        return searchText.includes(keyword.toLowerCase());
                    });
                    if (limit) return filteredRecords.slice(0, limit);
                    return filteredRecords;
                }
                async getRecentPromptRecords(user_id, days = 7) {
                    const cutoffDate = new Date();
                    cutoffDate.setDate(cutoffDate.getDate() - days);
                    return this.promptRecords.where('user_id').equals(user_id).and((record)=>(record.created_at || new Date(0)) >= cutoffDate).sortBy('created_at').then((records)=>records.reverse());
                }
                async createApiKey(apiKey) {
                    console.log('Creating new API Key:', apiKey);
                    const newApiKey = {
                        ...apiKey,
                        created_at: new Date()
                    };
                    if (newApiKey.is_current) {
                        console.log('Setting new API Key as current, updating existing current keys...');
                        await this.apiKeys.where({
                            user_id: newApiKey.user_id,
                            is_current: true
                        }).modify({
                            is_current: false
                        });
                    }
                    const id = await this.apiKeys.add(newApiKey);
                    const createdApiKey = {
                        ...newApiKey,
                        id
                    };
                    console.log('Created API Key:', createdApiKey);
                    return createdApiKey;
                }
                async getApiKey(id) {
                    return this.apiKeys.get(id);
                }
                async updateApiKey(id, updates) {
                    if (updates.is_current) {
                        const apiKey = await this.apiKeys.get(id);
                        if (apiKey) await this.apiKeys.where({
                            user_id: apiKey.user_id,
                            is_current: true
                        }).modify({
                            is_current: false
                        });
                    }
                    return this.apiKeys.update(id, updates);
                }
                async deleteApiKey(id) {
                    await this.apiKeys.delete(id);
                }
                async getUserApiKeys(user_id) {
                    return this.apiKeys.where('user_id').equals(user_id).toArray();
                }
                async getCurrentApiKey(user_id) {
                    console.log('Getting current API Key for user:', user_id);
                    const userApiKeys = await this.apiKeys.where('user_id').equals(user_id).toArray();
                    console.log('All user API Keys:', userApiKeys);
                    const currentApiKey = userApiKeys.find((key)=>key.is_current);
                    console.log('Found current API Key:', currentApiKey);
                    return currentApiKey;
                }
            }
            var _default = AppDatabase;
            const db = new AppDatabase();
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
        "src/pages/suno-cover/utils/dataLoader.ts": function(module, exports, __mako_require__) {
            "use strict";
            __mako_require__.d(exports, "__esModule", {
                value: true
            });
            function _export(target, all) {
                for(var name in all)Object.defineProperty(target, name, {
                    enumerable: true,
                    get: all[name]
                });
            }
            __mako_require__.e(exports, {
                loadRecordData: function() {
                    return loadRecordData;
                },
                processReferenceSongs: function() {
                    return processReferenceSongs;
                }
            });
            var _interop_require_wildcard = __mako_require__("@swc/helpers/_/_interop_require_wildcard");
            var _reactrefresh = _interop_require_wildcard._(__mako_require__("node_modules/.pnpm/react-refresh@0.14.2/node_modules/react-refresh/runtime.js"));
            var _antd = __mako_require__("node_modules/.pnpm/antd@6.1.1_date-fns@2.30.0_moment@2.30.1_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/antd/es/index.js");
            var _db = __mako_require__("src/services/db.ts");
            var prevRefreshReg;
            var prevRefreshSig;
            prevRefreshReg = self.$RefreshReg$;
            prevRefreshSig = self.$RefreshSig$;
            self.$RefreshReg$ = (type, id)=>{
                _reactrefresh.register(type, module.id + id);
            };
            self.$RefreshSig$ = _reactrefresh.createSignatureFunctionForTransform;
            const processReferenceSongs = async (referenceSongsData)=>{
                try {
                    if (!referenceSongsData) return [];
                    if (Array.isArray(referenceSongsData)) return referenceSongsData.filter((song)=>song && typeof song === 'object' && song.title && typeof song.title === 'string').map((song)=>({
                            title: song.title || '',
                            artist: song.artist || ''
                        }));
                    if (typeof referenceSongsData === 'string') try {
                        const parsed = JSON.parse(referenceSongsData);
                        if (Array.isArray(parsed)) return parsed.filter((song)=>song && typeof song === 'object' && song.title && typeof song.title === 'string').map((song)=>({
                                title: song.title || '',
                                artist: song.artist || ''
                            }));
                    } catch (_parseError) {
                        return [];
                    }
                    return [];
                } catch (_error) {
                    return [];
                }
            };
            const loadRecordData = async (recordId)=>{
                const formValues = {
                    song_name: '',
                    song_language: 'Mandarin',
                    target_artist: '',
                    style_note: '',
                    lyrics_raw: '',
                    extra_note: '',
                    reference_songs: []
                };
                if (!recordId) return {
                    formValues,
                    hasRecord: false
                };
                try {
                    const record = await _db.db.getPromptRecord(parseInt(recordId));
                    if (!record) {
                        _antd.message.error('记录不存在');
                        return {
                            formValues,
                            hasRecord: false
                        };
                    }
                    const processedReferenceSongs = await processReferenceSongs(record.user_input.reference_songs);
                    Object.assign(formValues, {
                        song_name: record.user_input.song_name || '',
                        song_language: record.user_input.song_language || 'Mandarin',
                        target_artist: record.user_input.target_singer || '',
                        style_note: record.user_input.style_description || '',
                        lyrics_raw: record.user_input.lyrics || '',
                        extra_note: record.user_input.scene || '',
                        reference_songs: processedReferenceSongs.length > 0 ? processedReferenceSongs : [
                            {
                                title: '',
                                artist: ''
                            }
                        ]
                    });
                    return {
                        formValues,
                        hasRecord: true
                    };
                } catch (error) {
                    _antd.message.error('数据加载失败');
                    return {
                        formValues,
                        hasRecord: false
                    };
                }
            };
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
        "src/pages/suno-cover/index.tsx": function(module, exports, __mako_require__) {
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
            var _procomponents = __mako_require__("node_modules/.pnpm/@ant-design+pro-components@2.8.10_antd@6.1.1_date-fns@2.30.0_moment@2.30.1_react-dom@19_19f9ea8e0f5beeabfed55731f55ca46d/node_modules/@ant-design/pro-components/es/index.js");
            var _max = __mako_require__("src/.umi/exports.ts");
            var _antd = __mako_require__("node_modules/.pnpm/antd@6.1.1_date-fns@2.30.0_moment@2.30.1_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/antd/es/index.js");
            var _react = _interop_require_wildcard._(__mako_require__("node_modules/.pnpm/react@19.2.3/node_modules/react/index.js"));
            var _components = __mako_require__("src/components/index.ts");
            var _useApiKey = __mako_require__("src/hooks/useApiKey.ts");
            var _container = __mako_require__("src/services/ai/container.ts");
            var _deepseekService = __mako_require__("src/services/ai/models/deepseekService.ts");
            var _geminiService = __mako_require__("src/services/ai/models/geminiService.ts");
            var _mimoService = __mako_require__("src/services/ai/models/mimoService.ts");
            var _db = __mako_require__("src/services/db.ts");
            var _mockData = __mako_require__("src/services/mockData.ts");
            var _utils = __mako_require__("src/shared/utils/index.ts");
            var _validationConfig = __mako_require__("src/pages/suno-cover/config/validationConfig.ts");
            var _dataLoader = __mako_require__("src/pages/suno-cover/utils/dataLoader.ts");
            var prevRefreshReg;
            var prevRefreshSig;
            prevRefreshReg = self.$RefreshReg$;
            prevRefreshSig = self.$RefreshSig$;
            self.$RefreshReg$ = (type, id)=>{
                _reactrefresh.register(type, module.id + id);
            };
            self.$RefreshSig$ = _reactrefresh.createSignatureFunctionForTransform;
            var _s = $RefreshSig$();
            const SunoCover = ()=>{
                _s();
                const [messageApi, contextHolder] = _antd.message.useMessage();
                const { apiKey, model, isLoading: apiKeyLoading, saveApiKey, deleteApiKey, validateApiKey } = (0, _useApiKey.useApiKey)();
                const [form] = _antd.Form.useForm();
                const proFormListRef = (0, _react.useRef)(null);
                const [searchParams] = (0, _max.useSearchParams)();
                const [loading, setLoading] = (0, _react.useState)(false);
                const [stylesResult, setStylesResult] = (0, _react.useState)('');
                const [lyricsResult, setLyricsResult] = (0, _react.useState)('');
                const [isFormInitialized, setIsFormInitialized] = (0, _react.useState)(false);
                const checkApiKey = (0, _react.useCallback)(()=>{
                    if (!apiKey) {
                        _antd.Modal.confirm({
                            title: '尚未设置 AI API Key',
                            content: '设置完成后即可使用该功能，是否现在去设置？',
                            okText: '去设置',
                            cancelText: '取消',
                            onOk () {
                                _max.history.push('/ai-setting');
                            }
                        });
                        return false;
                    }
                    return true;
                }, [
                    apiKey,
                    _max.history
                ]);
                const saveRecordToDB = (0, _react.useCallback)(async (values, result, isMock = false)=>{
                    try {
                        const userId = 1;
                        const referenceSongsArray = Array.isArray(values.reference_songs) ? values.reference_songs : [];
                        const referenceSongs = JSON.stringify(referenceSongsArray.filter((song)=>song && song.title && typeof song.title === 'string'));
                        const songLanguage = values.song_language || 'Mandarin';
                        const targetSinger = values.target_artist || '未知艺术家';
                        const lyrics = values.lyrics_raw || '无歌词';
                        const recordToSave = {
                            user_id: userId,
                            user_input: {
                                song_name: values.song_name,
                                song_language: songLanguage,
                                target_singer: targetSinger,
                                reference_songs: referenceSongs,
                                style_description: values.style_note || '',
                                lyrics,
                                scene: values.extra_note || ''
                            },
                            ai_result: {
                                styles: result.styles,
                                lyrics: result.lyrics,
                                model: isMock ? 'mock' : model
                            }
                        };
                        const record = await _db.db.createPromptRecord(recordToSave);
                        messageApi.success('记录已成功保存');
                        return record;
                    } catch (dbError) {
                        throw dbError;
                    }
                }, [
                    model,
                    messageApi
                ]);
                (0, _react.useEffect)(()=>{
                    const loadRecordFromURL = async ()=>{
                        const recordId = searchParams.get('recordId');
                        const { formValues, hasRecord } = await (0, _dataLoader.loadRecordData)(recordId);
                        if (hasRecord) {
                            setStylesResult(formValues.stylesResult || '');
                            setLyricsResult(formValues.lyricsResult || '');
                        }
                        form.setFieldsValue(formValues);
                        setIsFormInitialized(true);
                    };
                    loadRecordFromURL();
                }, [
                    searchParams,
                    form
                ]);
                const getAIService = ()=>{
                    switch(model){
                        case 'deepseek':
                            return _container.container.resolve(_deepseekService.DeepSeekService);
                        case 'gemini':
                            return _container.container.resolve(_geminiService.GeminiService);
                        case 'mimo':
                            return _container.container.resolve(_mimoService.MimoService);
                        default:
                            throw new Error(`Unsupported AI model: ${model}`);
                    }
                };
                const handleSubmit = (0, _react.useCallback)(async (values)=>{
                    if (!checkApiKey()) return;
                    setLoading(true);
                    try {
                        const aiService = getAIService();
                        const result = await aiService.generate({
                            ...values,
                            api_key: apiKey,
                            model
                        });
                        setStylesResult(result.styles);
                        setLyricsResult(result.lyrics);
                        messageApi.success('提示词已成功生成！');
                        await saveRecordToDB(values, result, false);
                    } catch (error) {
                        const errorMessage = error instanceof Error ? error.message : `调用 ${model} API 失败，请检查 API Key 或稍后再试。`;
                        messageApi.error(errorMessage);
                    } finally{
                        setLoading(false);
                    }
                }, [
                    checkApiKey,
                    apiKey,
                    model,
                    messageApi
                ]);
                const handleMockGenerate = (0, _react.useCallback)(async ()=>{
                    setLoading(true);
                    try {
                        const formValues = form.getFieldsValue();
                        const result = await (0, _mockData.mockGenerate)();
                        setStylesResult(result.styles);
                        setLyricsResult(result.lyrics);
                        messageApi.success('模拟生成已完成');
                        await saveRecordToDB(formValues, result, true);
                    } catch (error) {
                        messageApi.error('模拟生成失败，请稍后再试');
                    } finally{
                        setLoading(false);
                    }
                }, [
                    form,
                    messageApi
                ]);
                const handleTitleClick = (0, _react.useCallback)(()=>{
                    handleMockGenerate();
                }, [
                    handleMockGenerate
                ]);
                return (0, _jsxdevruntime.jsxDEV)(_jsxdevruntime.Fragment, {
                    children: [
                        contextHolder,
                        (0, _jsxdevruntime.jsxDEV)(_procomponents.PageContainer, {
                            children: [
                                !apiKey && (0, _jsxdevruntime.jsxDEV)(_antd.Alert, {
                                    title: "尚未设置 AI API Key，设置完成后即可使用该功能，是否现在去设置？",
                                    banner: true,
                                    style: {
                                        marginBottom: 24
                                    },
                                    action: (0, _jsxdevruntime.jsxDEV)(_antd.Button, {
                                        type: "link",
                                        onClick: ()=>_max.history.push('/ai-setting'),
                                        children: "去设置"
                                    }, void 0, false, {
                                        fileName: "src/pages/suno-cover/index.tsx",
                                        lineNumber: 276,
                                        columnNumber: 15
                                    }, void 0)
                                }, void 0, false, {
                                    fileName: "src/pages/suno-cover/index.tsx",
                                    lineNumber: 271,
                                    columnNumber: 11
                                }, this),
                                (0, _jsxdevruntime.jsxDEV)(_antd.Spin, {
                                    spinning: loading,
                                    fullscreen: true,
                                    size: "large"
                                }, void 0, false, {
                                    fileName: "src/pages/suno-cover/index.tsx",
                                    lineNumber: 284,
                                    columnNumber: 9
                                }, this),
                                (0, _jsxdevruntime.jsxDEV)(_antd.Row, {
                                    gutter: [
                                        24,
                                        0
                                    ],
                                    children: [
                                        (0, _jsxdevruntime.jsxDEV)(_antd.Col, {
                                            span: 8,
                                            children: (0, _jsxdevruntime.jsxDEV)(_procomponents.ProCard, {
                                                title: (0, _jsxdevruntime.jsxDEV)("span", {
                                                    onClick: handleTitleClick,
                                                    style: {
                                                        cursor: 'pointer'
                                                    },
                                                    children: "翻唱配置"
                                                }, void 0, false, {
                                                    fileName: "src/pages/suno-cover/index.tsx",
                                                    lineNumber: 291,
                                                    columnNumber: 17
                                                }, void 0),
                                                style: {
                                                    height: '100%'
                                                },
                                                children: !isFormInitialized ? (0, _jsxdevruntime.jsxDEV)("div", {
                                                    style: {
                                                        textAlign: 'center',
                                                        padding: '40px 0'
                                                    },
                                                    children: (0, _jsxdevruntime.jsxDEV)(_antd.Spin, {
                                                        size: "large"
                                                    }, void 0, false, {
                                                        fileName: "src/pages/suno-cover/index.tsx",
                                                        lineNumber: 300,
                                                        columnNumber: 19
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "src/pages/suno-cover/index.tsx",
                                                    lineNumber: 299,
                                                    columnNumber: 17
                                                }, this) : (0, _jsxdevruntime.jsxDEV)(_procomponents.ProForm, {
                                                    form: form,
                                                    layout: "vertical",
                                                    onFinish: handleSubmit,
                                                    submitter: {
                                                        render: ()=>(0, _jsxdevruntime.jsxDEV)(_antd.Flex, {
                                                                vertical: true,
                                                                gap: "small",
                                                                style: {
                                                                    marginTop: 16
                                                                },
                                                                children: (0, _jsxdevruntime.jsxDEV)(_antd.Button, {
                                                                    type: "primary",
                                                                    onClick: ()=>form.submit(),
                                                                    loading: loading,
                                                                    size: "large",
                                                                    block: true,
                                                                    children: "生成提示词"
                                                                }, void 0, false, {
                                                                    fileName: "src/pages/suno-cover/index.tsx",
                                                                    lineNumber: 311,
                                                                    columnNumber: 25
                                                                }, void 0)
                                                            }, void 0, false, {
                                                                fileName: "src/pages/suno-cover/index.tsx",
                                                                lineNumber: 309,
                                                                columnNumber: 23
                                                            }, void 0)
                                                    },
                                                    children: [
                                                        (0, _jsxdevruntime.jsxDEV)(_procomponents.ProFormText, {
                                                            name: "song_name",
                                                            label: "歌曲名称",
                                                            placeholder: "请输入歌曲名称，仅作为记录方便查询",
                                                            rules: _validationConfig.VALIDATION_RULES.songName,
                                                            fieldProps: _validationConfig.FIELD_CONFIGS.songName
                                                        }, void 0, false, {
                                                            fileName: "src/pages/suno-cover/index.tsx",
                                                            lineNumber: 325,
                                                            columnNumber: 19
                                                        }, this),
                                                        (0, _jsxdevruntime.jsxDEV)(_procomponents.ProFormSelect, {
                                                            name: "song_language",
                                                            label: "歌曲语言",
                                                            placeholder: "请选择歌曲语言",
                                                            rules: _validationConfig.VALIDATION_RULES.language,
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
                                                            ]
                                                        }, void 0, false, {
                                                            fileName: "src/pages/suno-cover/index.tsx",
                                                            lineNumber: 334,
                                                            columnNumber: 19
                                                        }, this),
                                                        (0, _jsxdevruntime.jsxDEV)(_procomponents.ProFormText, {
                                                            name: "target_artist",
                                                            label: "想模仿哪位艺术家？",
                                                            placeholder: "例如：张惠妹、陈奕迅、周杰伦等",
                                                            rules: _validationConfig.VALIDATION_RULES.artistName,
                                                            fieldProps: _validationConfig.FIELD_CONFIGS.artistName
                                                        }, void 0, false, {
                                                            fileName: "src/pages/suno-cover/index.tsx",
                                                            lineNumber: 351,
                                                            columnNumber: 19
                                                        }, this),
                                                        (0, _jsxdevruntime.jsxDEV)(_procomponents.ProFormList, {
                                                            actionRef: proFormListRef,
                                                            name: "reference_songs",
                                                            label: "参考歌曲（可选，最多 3 首）",
                                                            initialValue: [
                                                                {
                                                                    title: '',
                                                                    artist: ''
                                                                }
                                                            ],
                                                            creatorButtonProps: {
                                                                creatorButtonText: '添加参考歌曲',
                                                                type: 'dashed',
                                                                block: true
                                                            },
                                                            deleteIconProps: {
                                                                tooltipText: '删除该参考歌曲'
                                                            },
                                                            copyIconProps: false,
                                                            max: 3,
                                                            children: (meta)=>(0, _jsxdevruntime.jsxDEV)(_antd.Space, {
                                                                    style: {
                                                                        width: '100%'
                                                                    },
                                                                    children: [
                                                                        (0, _jsxdevruntime.jsxDEV)(_procomponents.ProFormText, {
                                                                            name: "title",
                                                                            placeholder: "歌曲名",
                                                                            rules: _validationConfig.VALIDATION_RULES.referenceSongTitle,
                                                                            fieldProps: {
                                                                                style: {
                                                                                    width: '100%'
                                                                                },
                                                                                ..._validationConfig.FIELD_CONFIGS.referenceSongTitle
                                                                            }
                                                                        }, void 0, false, {
                                                                            fileName: "src/pages/suno-cover/index.tsx",
                                                                            lineNumber: 378,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        (0, _jsxdevruntime.jsxDEV)(_procomponents.ProFormText, {
                                                                            name: "artist",
                                                                            placeholder: "演唱者（可选）",
                                                                            rules: _validationConfig.VALIDATION_RULES.referenceSongArtist,
                                                                            fieldProps: {
                                                                                style: {
                                                                                    width: '100%'
                                                                                },
                                                                                ..._validationConfig.FIELD_CONFIGS.referenceSongArtist
                                                                            }
                                                                        }, void 0, false, {
                                                                            fileName: "src/pages/suno-cover/index.tsx",
                                                                            lineNumber: 387,
                                                                            columnNumber: 25
                                                                        }, this)
                                                                    ]
                                                                }, meta.name, true, {
                                                                    fileName: "src/pages/suno-cover/index.tsx",
                                                                    lineNumber: 377,
                                                                    columnNumber: 23
                                                                }, this)
                                                        }, void 0, false, {
                                                            fileName: "src/pages/suno-cover/index.tsx",
                                                            lineNumber: 360,
                                                            columnNumber: 19
                                                        }, this),
                                                        (0, _jsxdevruntime.jsxDEV)(_procomponents.ProFormTextArea, {
                                                            name: "style_note",
                                                            label: "风格备注（可选）",
                                                            placeholder: "例如：主歌要像《人质》一样极度克制，副歌接近《听海》的情绪爆发。",
                                                            fieldProps: {
                                                                showCount: true,
                                                                rows: 3
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "src/pages/suno-cover/index.tsx",
                                                            lineNumber: 401,
                                                            columnNumber: 19
                                                        }, this),
                                                        (0, _jsxdevruntime.jsxDEV)(_procomponents.ProFormTextArea, {
                                                            name: "extra_note",
                                                            label: "特殊说明（如场景、受众等，可选）",
                                                            placeholder: "例如：演唱会现场版、录音室版本等",
                                                            fieldProps: {
                                                                showCount: true,
                                                                rows: 3
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "src/pages/suno-cover/index.tsx",
                                                            lineNumber: 409,
                                                            columnNumber: 19
                                                        }, this),
                                                        (0, _jsxdevruntime.jsxDEV)(_procomponents.ProFormTextArea, {
                                                            name: "lyrics_raw",
                                                            label: "段落与歌词",
                                                            placeholder: "请填写歌词，并使用任意标签划分段落，例如：【主歌】、【副歌】、[Verse]、[Chorus] 等",
                                                            rules: _validationConfig.VALIDATION_RULES.lyrics,
                                                            fieldProps: _validationConfig.FIELD_CONFIGS.lyrics
                                                        }, void 0, false, {
                                                            fileName: "src/pages/suno-cover/index.tsx",
                                                            lineNumber: 417,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "src/pages/suno-cover/index.tsx",
                                                    lineNumber: 303,
                                                    columnNumber: 17
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "src/pages/suno-cover/index.tsx",
                                                lineNumber: 289,
                                                columnNumber: 13
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "src/pages/suno-cover/index.tsx",
                                            lineNumber: 288,
                                            columnNumber: 11
                                        }, this),
                                        (0, _jsxdevruntime.jsxDEV)(_antd.Col, {
                                            span: 8,
                                            children: (0, _jsxdevruntime.jsxDEV)(_components.ResultCard, {
                                                title: "Styles 提示词（可直接复制用于 Suno）",
                                                value: stylesResult,
                                                onCopy: ()=>(0, _utils.copyToClipboard)(stylesResult, 'Styles')
                                            }, void 0, false, {
                                                fileName: "src/pages/suno-cover/index.tsx",
                                                lineNumber: 431,
                                                columnNumber: 13
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "src/pages/suno-cover/index.tsx",
                                            lineNumber: 430,
                                            columnNumber: 11
                                        }, this),
                                        (0, _jsxdevruntime.jsxDEV)(_antd.Col, {
                                            span: 8,
                                            children: (0, _jsxdevruntime.jsxDEV)(_components.ResultCard, {
                                                title: "Lyrics 提示词（可直接复制用于 Suno）",
                                                value: lyricsResult,
                                                onCopy: ()=>(0, _utils.copyToClipboard)(lyricsResult, 'Lyrics')
                                            }, void 0, false, {
                                                fileName: "src/pages/suno-cover/index.tsx",
                                                lineNumber: 440,
                                                columnNumber: 13
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "src/pages/suno-cover/index.tsx",
                                            lineNumber: 439,
                                            columnNumber: 11
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "src/pages/suno-cover/index.tsx",
                                    lineNumber: 286,
                                    columnNumber: 9
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "src/pages/suno-cover/index.tsx",
                            lineNumber: 268,
                            columnNumber: 7
                        }, this)
                    ]
                }, void 0, true);
            };
            _s(SunoCover, "9n+XL71qz2kJcOtQxKH4HzEIM+Q=", false, function() {
                return [
                    _antd.message.useMessage,
                    _useApiKey.useApiKey,
                    _antd.Form.useForm,
                    _max.useSearchParams
                ];
            });
            _c = SunoCover;
            var _default = SunoCover;
            var _c;
            $RefreshReg$(_c, "SunoCover");
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
        "src/services/ai/models/mimoService.ts": function(module, exports, __mako_require__) {
            "use strict";
            __mako_require__.d(exports, "__esModule", {
                value: true
            });
            __mako_require__.d(exports, "MimoService", {
                enumerable: true,
                get: function() {
                    return MimoService;
                }
            });
            var _interop_require_wildcard = __mako_require__("@swc/helpers/_/_interop_require_wildcard");
            var _ts_decorate = __mako_require__("node_modules/.pnpm/@swc+helpers@0.5.1/node_modules/@swc/helpers/esm/_ts_decorate.js");
            var _reactrefresh = _interop_require_wildcard._(__mako_require__("node_modules/.pnpm/react-refresh@0.14.2/node_modules/react-refresh/runtime.js"));
            var _tsyringe = __mako_require__("node_modules/.pnpm/tsyringe@4.10.0/node_modules/tsyringe/dist/esm5/index.js");
            var _baseAIService = __mako_require__("src/services/ai/baseAIService.ts");
            var _prompts = __mako_require__("src/config/prompts.ts");
            var prevRefreshReg;
            var prevRefreshSig;
            prevRefreshReg = self.$RefreshReg$;
            prevRefreshSig = self.$RefreshSig$;
            self.$RefreshReg$ = (type, id)=>{
                _reactrefresh.register(type, module.id + id);
            };
            self.$RefreshSig$ = _reactrefresh.createSignatureFunctionForTransform;
            class MimoService extends _baseAIService.BaseAIService {
                async generate(request) {
                    const { api_key: apiKey } = request;
                    if (!apiKey) throw new Error('MiMo API key is required');
                    const userPrompt = this.generateUserPrompt(request);
                    const systemPrompt = _prompts.SYSTEM_PROMPT;
                    try {
                        const apiUrl = '/mimo-api/v1/chat/completions';
                        const response = await fetch(apiUrl, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${apiKey}`
                            },
                            body: JSON.stringify({
                                model: 'mimo-v2-flash',
                                messages: [
                                    {
                                        role: 'system',
                                        content: systemPrompt
                                    },
                                    {
                                        role: 'user',
                                        content: userPrompt
                                    }
                                ],
                                temperature: 0.8,
                                top_p: 0.95,
                                max_tokens: 4096,
                                stream: false,
                                extra_body: {
                                    "thinking": {
                                        "type": "enabled"
                                    }
                                }
                            })
                        });
                        if (!response.ok) {
                            const errorData = await response.text();
                            console.error('MiMo API error:', {
                                status: response.status,
                                statusText: response.statusText,
                                url: response.url,
                                errorData
                            });
                            throw new Error(`MiMo API request failed with status ${response.status}: ${response.statusText}`);
                        }
                        const data = await response.json();
                        const aiResponse = data.choices[0].message.content;
                        return this.parseResponse(aiResponse);
                    } catch (error) {
                        console.error('Error calling MiMo API:', error);
                        throw error;
                    }
                }
            }
            MimoService = (0, _ts_decorate._)([
                (0, _tsyringe.injectable)()
            ], MimoService);
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
        "src/services/ai/models/deepseekService.ts": function(module, exports, __mako_require__) {
            "use strict";
            __mako_require__.d(exports, "__esModule", {
                value: true
            });
            __mako_require__.d(exports, "DeepSeekService", {
                enumerable: true,
                get: function() {
                    return DeepSeekService;
                }
            });
            var _interop_require_wildcard = __mako_require__("@swc/helpers/_/_interop_require_wildcard");
            var _ts_decorate = __mako_require__("node_modules/.pnpm/@swc+helpers@0.5.1/node_modules/@swc/helpers/esm/_ts_decorate.js");
            var _reactrefresh = _interop_require_wildcard._(__mako_require__("node_modules/.pnpm/react-refresh@0.14.2/node_modules/react-refresh/runtime.js"));
            var _tsyringe = __mako_require__("node_modules/.pnpm/tsyringe@4.10.0/node_modules/tsyringe/dist/esm5/index.js");
            var _baseAIService = __mako_require__("src/services/ai/baseAIService.ts");
            var _prompts = __mako_require__("src/config/prompts.ts");
            var prevRefreshReg;
            var prevRefreshSig;
            prevRefreshReg = self.$RefreshReg$;
            prevRefreshSig = self.$RefreshSig$;
            self.$RefreshReg$ = (type, id)=>{
                _reactrefresh.register(type, module.id + id);
            };
            self.$RefreshSig$ = _reactrefresh.createSignatureFunctionForTransform;
            class DeepSeekService extends _baseAIService.BaseAIService {
                async generate(request) {
                    const { api_key: apiKey } = request;
                    if (!apiKey) throw new Error('DeepSeek API key is required');
                    const userPrompt = this.generateUserPrompt(request);
                    const systemPrompt = _prompts.SYSTEM_PROMPT;
                    try {
                        const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${apiKey}`
                            },
                            body: JSON.stringify({
                                model: 'deepseek-chat',
                                messages: [
                                    {
                                        role: 'system',
                                        content: systemPrompt
                                    },
                                    {
                                        role: 'user',
                                        content: userPrompt
                                    }
                                ],
                                temperature: 1.3,
                                max_tokens: 4096
                            })
                        });
                        if (!response.ok) {
                            const errorData = await response.text();
                            console.error('DeepSeek API error:', response.status, errorData);
                            throw new Error(`DeepSeek API request failed with status ${response.status}`);
                        }
                        const data = await response.json();
                        const aiResponse = data.choices[0].message.content;
                        return this.parseResponse(aiResponse);
                    } catch (error) {
                        console.error('Error calling DeepSeek API:', error);
                        throw error;
                    }
                }
            }
            DeepSeekService = (0, _ts_decorate._)([
                (0, _tsyringe.injectable)()
            ], DeepSeekService);
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
        "src/services/ai/models/geminiService.ts": function(module, exports, __mako_require__) {
            "use strict";
            __mako_require__.d(exports, "__esModule", {
                value: true
            });
            __mako_require__.d(exports, "GeminiService", {
                enumerable: true,
                get: function() {
                    return GeminiService;
                }
            });
            var _interop_require_wildcard = __mako_require__("@swc/helpers/_/_interop_require_wildcard");
            var _ts_decorate = __mako_require__("node_modules/.pnpm/@swc+helpers@0.5.1/node_modules/@swc/helpers/esm/_ts_decorate.js");
            var _reactrefresh = _interop_require_wildcard._(__mako_require__("node_modules/.pnpm/react-refresh@0.14.2/node_modules/react-refresh/runtime.js"));
            var _tsyringe = __mako_require__("node_modules/.pnpm/tsyringe@4.10.0/node_modules/tsyringe/dist/esm5/index.js");
            var _baseAIService = __mako_require__("src/services/ai/baseAIService.ts");
            var _genai = __mako_require__("node_modules/.pnpm/@google+genai@1.34.0/node_modules/@google/genai/dist/web/index.mjs");
            var _prompts = __mako_require__("src/config/prompts.ts");
            var prevRefreshReg;
            var prevRefreshSig;
            prevRefreshReg = self.$RefreshReg$;
            prevRefreshSig = self.$RefreshSig$;
            self.$RefreshReg$ = (type, id)=>{
                _reactrefresh.register(type, module.id + id);
            };
            self.$RefreshSig$ = _reactrefresh.createSignatureFunctionForTransform;
            class GeminiService extends _baseAIService.BaseAIService {
                async generate(request) {
                    const { api_key: apiKey } = request;
                    if (!apiKey) throw new Error('Gemini API key is required');
                    const userPrompt = this.generateUserPrompt(request);
                    const systemPrompt = _prompts.SYSTEM_PROMPT;
                    try {
                        const genAI = new _genai.GoogleGenAI({
                            apiKey
                        });
                        const result = await genAI.models.generateContent({
                            model: 'gemini-3-flash-preview',
                            contents: [
                                {
                                    parts: [
                                        {
                                            text: systemPrompt + '\n\n' + userPrompt
                                        }
                                    ]
                                }
                            ]
                        });
                        let aiResponse = '';
                        if (result.candidates && result.candidates.length > 0) {
                            const firstCandidate = result.candidates[0];
                            if (firstCandidate.content && firstCandidate.content.parts) aiResponse = firstCandidate.content.parts.filter((part)=>part.text).map((part)=>part.text).join('\n');
                        }
                        return this.parseResponse(aiResponse);
                    } catch (error) {
                        console.error('Error calling Gemini API:', error);
                        throw error;
                    }
                }
            }
            GeminiService = (0, _ts_decorate._)([
                (0, _tsyringe.injectable)()
            ], GeminiService);
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
        "src/services/ai/baseAIService.ts": function(module, exports, __mako_require__) {
            "use strict";
            __mako_require__.d(exports, "__esModule", {
                value: true
            });
            __mako_require__.d(exports, "BaseAIService", {
                enumerable: true,
                get: function() {
                    return BaseAIService;
                }
            });
            var _interop_require_wildcard = __mako_require__("@swc/helpers/_/_interop_require_wildcard");
            var _reactrefresh = _interop_require_wildcard._(__mako_require__("node_modules/.pnpm/react-refresh@0.14.2/node_modules/react-refresh/runtime.js"));
            var _prompts = __mako_require__("src/config/prompts.ts");
            var prevRefreshReg;
            var prevRefreshSig;
            prevRefreshReg = self.$RefreshReg$;
            prevRefreshSig = self.$RefreshSig$;
            self.$RefreshReg$ = (type, id)=>{
                _reactrefresh.register(type, module.id + id);
            };
            self.$RefreshSig$ = _reactrefresh.createSignatureFunctionForTransform;
            class BaseAIService {
                generateUserPrompt(request) {
                    const { target_artist, lyrics_raw, song_language, reference_songs, style_note, extra_note } = request;
                    const getFullLanguageName = (language)=>{
                        const languageMap = {
                            'Mandarin': 'Mandarin Chinese',
                            'Cantonese': 'Cantonese Chinese',
                            'English': 'English',
                            'Japanese': 'Japanese',
                            'Korean': 'Korean',
                            'Spanish': 'Spanish',
                            'French': 'French',
                            'German': 'German'
                        };
                        return languageMap[language] || language;
                    };
                    const formatReferenceSongs = (songs, targetArtist)=>{
                        if (!songs || songs.length === 0) return 'None provided.';
                        return songs.filter((song)=>song.title).map((song)=>{
                            const artistPart = song.artist && song.artist !== targetArtist ? ` by ${song.artist}` : '';
                            return `- "${song.title}"${artistPart}`;
                        }).join('\n  ');
                    };
                    const fullLanguageName = getFullLanguageName(song_language);
                    const referenceSongsBlock = formatReferenceSongs(reference_songs, target_artist);
                    return _prompts.USER_PROMPT_TEMPLATE.replace('{fullLanguageName}', fullLanguageName).replace('{targetArtist}', target_artist).replace('{referenceSongsBlock}', referenceSongsBlock).replace('{styleNote}', style_note || '').replace('{extraNote}', extra_note || '').replace('{lyricsRaw}', lyrics_raw);
                }
                validateRequest(request) {
                    if (!request.target_artist) throw new Error('请输入目标艺术家');
                    if (!request.lyrics_raw) throw new Error('请输入歌词');
                    if (!request.song_language) throw new Error('请输入歌曲语言');
                }
                referenceSongsToText(songs) {
                    if (!songs || songs.length === 0) return '';
                    return songs.map((song, index)=>{
                        if (song.title && song.artist) return `${index + 1}. ${song.title} - ${song.artist}`;
                        else if (song.title) return `${index + 1}. ${song.title}`;
                        return '';
                    }).filter(Boolean).join('\n');
                }
                async parseResponse(rawResponse) {
                    try {
                        let responseText = rawResponse.trim();
                        const stylesMatch = responseText.match(/### Styles[\s\S]*?(?=### Lyrics|$)/);
                        const lyricsMatch = responseText.match(/### Lyrics[\s\S]*/);
                        let stylesContent = '';
                        let lyricsContent = '';
                        if (stylesMatch) {
                            stylesContent = stylesMatch[0].replace(/### Styles/, '').trim();
                            stylesContent = stylesContent.replace(/```text\s*([\s\S]*?)\s*```/, '$1').trim();
                        }
                        if (lyricsMatch) {
                            lyricsContent = lyricsMatch[0].replace(/### Lyrics/, '').trim();
                            lyricsContent = lyricsContent.replace(/```text\s*([\s\S]*?)\s*```/, '$1').trim();
                        }
                        return {
                            styles: stylesContent,
                            lyrics: lyricsContent,
                            timestamp: new Date().toISOString()
                        };
                    } catch (error) {
                        console.error('响应解析失败:', error);
                        return {
                            styles: rawResponse.trim(),
                            lyrics: '',
                            timestamp: new Date().toISOString()
                        };
                    }
                }
            }
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
        "src/services/ai/container.ts": function(module, exports, __mako_require__) {
            "use strict";
            __mako_require__.d(exports, "__esModule", {
                value: true
            });
            function _export(target, all) {
                for(var name in all)Object.defineProperty(target, name, {
                    enumerable: true,
                    get: all[name]
                });
            }
            __mako_require__.e(exports, {
                container: function() {
                    return _tsyringe.container;
                },
                injectable: function() {
                    return _tsyringe.injectable;
                },
                registerServices: function() {
                    return registerServices;
                }
            });
            var _interop_require_wildcard = __mako_require__("@swc/helpers/_/_interop_require_wildcard");
            var _reactrefresh = _interop_require_wildcard._(__mako_require__("node_modules/.pnpm/react-refresh@0.14.2/node_modules/react-refresh/runtime.js"));
            var _tsyringe = __mako_require__("node_modules/.pnpm/tsyringe@4.10.0/node_modules/tsyringe/dist/esm5/index.js");
            var _deepseekService = __mako_require__("src/services/ai/models/deepseekService.ts");
            var _geminiService = __mako_require__("src/services/ai/models/geminiService.ts");
            var _mimoService = __mako_require__("src/services/ai/models/mimoService.ts");
            var prevRefreshReg;
            var prevRefreshSig;
            prevRefreshReg = self.$RefreshReg$;
            prevRefreshSig = self.$RefreshSig$;
            self.$RefreshReg$ = (type, id)=>{
                _reactrefresh.register(type, module.id + id);
            };
            self.$RefreshSig$ = _reactrefresh.createSignatureFunctionForTransform;
            function registerServices() {
                _tsyringe.container.register(_deepseekService.DeepSeekService, {
                    useClass: _deepseekService.DeepSeekService
                });
                _tsyringe.container.register(_geminiService.GeminiService, {
                    useClass: _geminiService.GeminiService
                });
                _tsyringe.container.register(_mimoService.MimoService, {
                    useClass: _mimoService.MimoService
                });
            }
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
        "node_modules/.pnpm/@google+genai@1.34.0/node_modules/@google/genai/dist/web/index.mjs": function(module, exports, __mako_require__) {
            "use strict";
            __mako_require__.d(exports, "__esModule", {
                value: true
            });
            function _export(target, all) {
                for(var name in all)Object.defineProperty(target, name, {
                    enumerable: true,
                    get: all[name]
                });
            }
            __mako_require__.e(exports, {
                ActivityHandling: function() {
                    return ActivityHandling;
                },
                AdapterSize: function() {
                    return AdapterSize;
                },
                ApiError: function() {
                    return ApiError;
                },
                ApiSpec: function() {
                    return ApiSpec;
                },
                AuthType: function() {
                    return AuthType;
                },
                Batches: function() {
                    return Batches;
                },
                Behavior: function() {
                    return Behavior;
                },
                BlockedReason: function() {
                    return BlockedReason;
                },
                Caches: function() {
                    return Caches;
                },
                CancelTuningJobResponse: function() {
                    return CancelTuningJobResponse;
                },
                Chat: function() {
                    return Chat;
                },
                Chats: function() {
                    return Chats;
                },
                ComputeTokensResponse: function() {
                    return ComputeTokensResponse;
                },
                ContentReferenceImage: function() {
                    return ContentReferenceImage;
                },
                ControlReferenceImage: function() {
                    return ControlReferenceImage;
                },
                ControlReferenceType: function() {
                    return ControlReferenceType;
                },
                CountTokensResponse: function() {
                    return CountTokensResponse;
                },
                CreateFileResponse: function() {
                    return CreateFileResponse;
                },
                DeleteCachedContentResponse: function() {
                    return DeleteCachedContentResponse;
                },
                DeleteFileResponse: function() {
                    return DeleteFileResponse;
                },
                DeleteModelResponse: function() {
                    return DeleteModelResponse;
                },
                DocumentState: function() {
                    return DocumentState;
                },
                DynamicRetrievalConfigMode: function() {
                    return DynamicRetrievalConfigMode;
                },
                EditImageResponse: function() {
                    return EditImageResponse;
                },
                EditMode: function() {
                    return EditMode;
                },
                EmbedContentResponse: function() {
                    return EmbedContentResponse;
                },
                EndSensitivity: function() {
                    return EndSensitivity;
                },
                Environment: function() {
                    return Environment;
                },
                FeatureSelectionPreference: function() {
                    return FeatureSelectionPreference;
                },
                FileSource: function() {
                    return FileSource;
                },
                FileState: function() {
                    return FileState;
                },
                Files: function() {
                    return Files;
                },
                FinishReason: function() {
                    return FinishReason;
                },
                FunctionCallingConfigMode: function() {
                    return FunctionCallingConfigMode;
                },
                FunctionResponse: function() {
                    return FunctionResponse;
                },
                FunctionResponseBlob: function() {
                    return FunctionResponseBlob;
                },
                FunctionResponseFileData: function() {
                    return FunctionResponseFileData;
                },
                FunctionResponsePart: function() {
                    return FunctionResponsePart;
                },
                FunctionResponseScheduling: function() {
                    return FunctionResponseScheduling;
                },
                GenerateContentResponse: function() {
                    return GenerateContentResponse;
                },
                GenerateContentResponsePromptFeedback: function() {
                    return GenerateContentResponsePromptFeedback;
                },
                GenerateContentResponseUsageMetadata: function() {
                    return GenerateContentResponseUsageMetadata;
                },
                GenerateImagesResponse: function() {
                    return GenerateImagesResponse;
                },
                GenerateVideosOperation: function() {
                    return GenerateVideosOperation;
                },
                GenerateVideosResponse: function() {
                    return GenerateVideosResponse;
                },
                GoogleGenAI: function() {
                    return GoogleGenAI;
                },
                HarmBlockMethod: function() {
                    return HarmBlockMethod;
                },
                HarmBlockThreshold: function() {
                    return HarmBlockThreshold;
                },
                HarmCategory: function() {
                    return HarmCategory;
                },
                HarmProbability: function() {
                    return HarmProbability;
                },
                HarmSeverity: function() {
                    return HarmSeverity;
                },
                HttpElementLocation: function() {
                    return HttpElementLocation;
                },
                HttpResponse: function() {
                    return HttpResponse;
                },
                ImagePromptLanguage: function() {
                    return ImagePromptLanguage;
                },
                ImportFileOperation: function() {
                    return ImportFileOperation;
                },
                ImportFileResponse: function() {
                    return ImportFileResponse;
                },
                InlinedEmbedContentResponse: function() {
                    return InlinedEmbedContentResponse;
                },
                InlinedResponse: function() {
                    return InlinedResponse;
                },
                JobState: function() {
                    return JobState;
                },
                Language: function() {
                    return Language;
                },
                ListBatchJobsResponse: function() {
                    return ListBatchJobsResponse;
                },
                ListCachedContentsResponse: function() {
                    return ListCachedContentsResponse;
                },
                ListDocumentsResponse: function() {
                    return ListDocumentsResponse;
                },
                ListFileSearchStoresResponse: function() {
                    return ListFileSearchStoresResponse;
                },
                ListFilesResponse: function() {
                    return ListFilesResponse;
                },
                ListModelsResponse: function() {
                    return ListModelsResponse;
                },
                ListTuningJobsResponse: function() {
                    return ListTuningJobsResponse;
                },
                Live: function() {
                    return Live;
                },
                LiveClientToolResponse: function() {
                    return LiveClientToolResponse;
                },
                LiveMusicPlaybackControl: function() {
                    return LiveMusicPlaybackControl;
                },
                LiveMusicServerMessage: function() {
                    return LiveMusicServerMessage;
                },
                LiveSendToolResponseParameters: function() {
                    return LiveSendToolResponseParameters;
                },
                LiveServerMessage: function() {
                    return LiveServerMessage;
                },
                MaskReferenceImage: function() {
                    return MaskReferenceImage;
                },
                MaskReferenceMode: function() {
                    return MaskReferenceMode;
                },
                MediaModality: function() {
                    return MediaModality;
                },
                MediaResolution: function() {
                    return MediaResolution;
                },
                Modality: function() {
                    return Modality;
                },
                Mode: function() {
                    return Mode;
                },
                Models: function() {
                    return Models;
                },
                MusicGenerationMode: function() {
                    return MusicGenerationMode;
                },
                Operations: function() {
                    return Operations;
                },
                Outcome: function() {
                    return Outcome;
                },
                PagedItem: function() {
                    return PagedItem;
                },
                Pager: function() {
                    return Pager;
                },
                PartMediaResolutionLevel: function() {
                    return PartMediaResolutionLevel;
                },
                PersonGeneration: function() {
                    return PersonGeneration;
                },
                PhishBlockThreshold: function() {
                    return PhishBlockThreshold;
                },
                RawReferenceImage: function() {
                    return RawReferenceImage;
                },
                RecontextImageResponse: function() {
                    return RecontextImageResponse;
                },
                ReplayResponse: function() {
                    return ReplayResponse;
                },
                SafetyFilterLevel: function() {
                    return SafetyFilterLevel;
                },
                Scale: function() {
                    return Scale;
                },
                SegmentImageResponse: function() {
                    return SegmentImageResponse;
                },
                SegmentMode: function() {
                    return SegmentMode;
                },
                Session: function() {
                    return Session;
                },
                SingleEmbedContentResponse: function() {
                    return SingleEmbedContentResponse;
                },
                StartSensitivity: function() {
                    return StartSensitivity;
                },
                StyleReferenceImage: function() {
                    return StyleReferenceImage;
                },
                SubjectReferenceImage: function() {
                    return SubjectReferenceImage;
                },
                SubjectReferenceType: function() {
                    return SubjectReferenceType;
                },
                ThinkingLevel: function() {
                    return ThinkingLevel;
                },
                Tokens: function() {
                    return Tokens;
                },
                TrafficType: function() {
                    return TrafficType;
                },
                TuningMethod: function() {
                    return TuningMethod;
                },
                TuningMode: function() {
                    return TuningMode;
                },
                TuningTask: function() {
                    return TuningTask;
                },
                TurnCompleteReason: function() {
                    return TurnCompleteReason;
                },
                TurnCoverage: function() {
                    return TurnCoverage;
                },
                Type: function() {
                    return Type;
                },
                UploadToFileSearchStoreOperation: function() {
                    return UploadToFileSearchStoreOperation;
                },
                UploadToFileSearchStoreResponse: function() {
                    return UploadToFileSearchStoreResponse;
                },
                UploadToFileSearchStoreResumableResponse: function() {
                    return UploadToFileSearchStoreResumableResponse;
                },
                UpscaleImageResponse: function() {
                    return UpscaleImageResponse;
                },
                UrlRetrievalStatus: function() {
                    return UrlRetrievalStatus;
                },
                VadSignalType: function() {
                    return VadSignalType;
                },
                VideoCompressionQuality: function() {
                    return VideoCompressionQuality;
                },
                VideoGenerationMaskMode: function() {
                    return VideoGenerationMaskMode;
                },
                VideoGenerationReferenceType: function() {
                    return VideoGenerationReferenceType;
                },
                createFunctionResponsePartFromBase64: function() {
                    return createFunctionResponsePartFromBase64;
                },
                createFunctionResponsePartFromUri: function() {
                    return createFunctionResponsePartFromUri;
                },
                createModelContent: function() {
                    return createModelContent;
                },
                createPartFromBase64: function() {
                    return createPartFromBase64;
                },
                createPartFromCodeExecutionResult: function() {
                    return createPartFromCodeExecutionResult;
                },
                createPartFromExecutableCode: function() {
                    return createPartFromExecutableCode;
                },
                createPartFromFunctionCall: function() {
                    return createPartFromFunctionCall;
                },
                createPartFromFunctionResponse: function() {
                    return createPartFromFunctionResponse;
                },
                createPartFromText: function() {
                    return createPartFromText;
                },
                createPartFromUri: function() {
                    return createPartFromUri;
                },
                createUserContent: function() {
                    return createUserContent;
                },
                mcpToTool: function() {
                    return mcpToTool;
                },
                setDefaultBaseUrls: function() {
                    return setDefaultBaseUrls;
                }
            });
            let _defaultBaseGeminiUrl = undefined;
            let _defaultBaseVertexUrl = undefined;
            function setDefaultBaseUrls(baseUrlParams) {
                _defaultBaseGeminiUrl = baseUrlParams.geminiUrl;
                _defaultBaseVertexUrl = baseUrlParams.vertexUrl;
            }
            function getDefaultBaseUrls() {
                return {
                    geminiUrl: _defaultBaseGeminiUrl,
                    vertexUrl: _defaultBaseVertexUrl
                };
            }
            function getBaseUrl(httpOptions, vertexai, vertexBaseUrlFromEnv, geminiBaseUrlFromEnv) {
                var _a, _b;
                if (!(httpOptions === null || httpOptions === void 0 ? void 0 : httpOptions.baseUrl)) {
                    const defaultBaseUrls = getDefaultBaseUrls();
                    if (vertexai) return (_a = defaultBaseUrls.vertexUrl) !== null && _a !== void 0 ? _a : vertexBaseUrlFromEnv;
                    else return (_b = defaultBaseUrls.geminiUrl) !== null && _b !== void 0 ? _b : geminiBaseUrlFromEnv;
                }
                return httpOptions.baseUrl;
            }
            class BaseModule {
            }
            function formatMap(templateString, valueMap) {
                const regex = /\{([^}]+)\}/g;
                return templateString.replace(regex, (match, key)=>{
                    if (Object.prototype.hasOwnProperty.call(valueMap, key)) {
                        const value = valueMap[key];
                        return value !== undefined && value !== null ? String(value) : '';
                    } else throw new Error(`Key '${key}' not found in valueMap.`);
                });
            }
            function setValueByPath(data, keys, value) {
                for(let i = 0; i < keys.length - 1; i++){
                    const key = keys[i];
                    if (key.endsWith('[]')) {
                        const keyName = key.slice(0, -2);
                        if (!(keyName in data)) {
                            if (Array.isArray(value)) data[keyName] = Array.from({
                                length: value.length
                            }, ()=>({}));
                            else throw new Error(`Value must be a list given an array path ${key}`);
                        }
                        if (Array.isArray(data[keyName])) {
                            const arrayData = data[keyName];
                            if (Array.isArray(value)) for(let j = 0; j < arrayData.length; j++){
                                const entry = arrayData[j];
                                setValueByPath(entry, keys.slice(i + 1), value[j]);
                            }
                            else for (const d of arrayData)setValueByPath(d, keys.slice(i + 1), value);
                        }
                        return;
                    } else if (key.endsWith('[0]')) {
                        const keyName = key.slice(0, -3);
                        if (!(keyName in data)) data[keyName] = [
                            {}
                        ];
                        const arrayData = data[keyName];
                        setValueByPath(arrayData[0], keys.slice(i + 1), value);
                        return;
                    }
                    if (!data[key] || typeof data[key] !== 'object') data[key] = {};
                    data = data[key];
                }
                const keyToSet = keys[keys.length - 1];
                const existingData = data[keyToSet];
                if (existingData !== undefined) {
                    if (!value || typeof value === 'object' && Object.keys(value).length === 0) return;
                    if (value === existingData) return;
                    if (typeof existingData === 'object' && typeof value === 'object' && existingData !== null && value !== null) Object.assign(existingData, value);
                    else throw new Error(`Cannot set value for an existing key. Key: ${keyToSet}`);
                } else if (keyToSet === '_self' && typeof value === 'object' && value !== null && !Array.isArray(value)) {
                    const valueAsRecord = value;
                    Object.assign(data, valueAsRecord);
                } else data[keyToSet] = value;
            }
            function getValueByPath(data, keys, defaultValue) {
                try {
                    if (keys.length === 1 && keys[0] === '_self') return data;
                    for(let i = 0; i < keys.length; i++){
                        if (typeof data !== 'object' || data === null) return defaultValue;
                        const key = keys[i];
                        if (key.endsWith('[]')) {
                            const keyName = key.slice(0, -2);
                            if (keyName in data) {
                                const arrayData = data[keyName];
                                if (!Array.isArray(arrayData)) return defaultValue;
                                return arrayData.map((d)=>getValueByPath(d, keys.slice(i + 1), defaultValue));
                            } else return defaultValue;
                        } else data = data[key];
                    }
                    return data;
                } catch (error) {
                    if (error instanceof TypeError) return defaultValue;
                    throw error;
                }
            }
            function moveValueByPath(data, paths) {
                for (const [sourcePath, destPath] of Object.entries(paths)){
                    const sourceKeys = sourcePath.split('.');
                    const destKeys = destPath.split('.');
                    const excludeKeys = new Set();
                    let wildcardIdx = -1;
                    for(let i = 0; i < sourceKeys.length; i++)if (sourceKeys[i] === '*') {
                        wildcardIdx = i;
                        break;
                    }
                    if (wildcardIdx !== -1 && destKeys.length > wildcardIdx) for(let i = wildcardIdx; i < destKeys.length; i++){
                        const key = destKeys[i];
                        if (key !== '*' && !key.endsWith('[]') && !key.endsWith('[0]')) excludeKeys.add(key);
                    }
                    _moveValueRecursive(data, sourceKeys, destKeys, 0, excludeKeys);
                }
            }
            function _moveValueRecursive(data, sourceKeys, destKeys, keyIdx, excludeKeys) {
                if (keyIdx >= sourceKeys.length) return;
                if (typeof data !== 'object' || data === null) return;
                const key = sourceKeys[keyIdx];
                if (key.endsWith('[]')) {
                    const keyName = key.slice(0, -2);
                    const dataRecord = data;
                    if (keyName in dataRecord && Array.isArray(dataRecord[keyName])) for (const item of dataRecord[keyName])_moveValueRecursive(item, sourceKeys, destKeys, keyIdx + 1, excludeKeys);
                } else if (key === '*') {
                    if (typeof data === 'object' && data !== null && !Array.isArray(data)) {
                        const dataRecord = data;
                        const keysToMove = Object.keys(dataRecord).filter((k)=>!k.startsWith('_') && !excludeKeys.has(k));
                        const valuesToMove = {};
                        for (const k of keysToMove)valuesToMove[k] = dataRecord[k];
                        for (const [k, v] of Object.entries(valuesToMove)){
                            const newDestKeys = [];
                            for (const dk of destKeys.slice(keyIdx))if (dk === '*') newDestKeys.push(k);
                            else newDestKeys.push(dk);
                            setValueByPath(dataRecord, newDestKeys, v);
                        }
                        for (const k of keysToMove)delete dataRecord[k];
                    }
                } else {
                    const dataRecord = data;
                    if (key in dataRecord) _moveValueRecursive(dataRecord[key], sourceKeys, destKeys, keyIdx + 1, excludeKeys);
                }
            }
            function tBytes$1(fromBytes) {
                if (typeof fromBytes !== 'string') throw new Error('fromImageBytes must be a string');
                return fromBytes;
            }
            function fetchPredictOperationParametersToVertex(fromObject) {
                const toObject = {};
                const fromOperationName = getValueByPath(fromObject, [
                    'operationName'
                ]);
                if (fromOperationName != null) setValueByPath(toObject, [
                    'operationName'
                ], fromOperationName);
                const fromResourceName = getValueByPath(fromObject, [
                    'resourceName'
                ]);
                if (fromResourceName != null) setValueByPath(toObject, [
                    '_url',
                    'resourceName'
                ], fromResourceName);
                return toObject;
            }
            function generateVideosOperationFromMldev$1(fromObject) {
                const toObject = {};
                const fromName = getValueByPath(fromObject, [
                    'name'
                ]);
                if (fromName != null) setValueByPath(toObject, [
                    'name'
                ], fromName);
                const fromMetadata = getValueByPath(fromObject, [
                    'metadata'
                ]);
                if (fromMetadata != null) setValueByPath(toObject, [
                    'metadata'
                ], fromMetadata);
                const fromDone = getValueByPath(fromObject, [
                    'done'
                ]);
                if (fromDone != null) setValueByPath(toObject, [
                    'done'
                ], fromDone);
                const fromError = getValueByPath(fromObject, [
                    'error'
                ]);
                if (fromError != null) setValueByPath(toObject, [
                    'error'
                ], fromError);
                const fromResponse = getValueByPath(fromObject, [
                    'response',
                    'generateVideoResponse'
                ]);
                if (fromResponse != null) setValueByPath(toObject, [
                    'response'
                ], generateVideosResponseFromMldev$1(fromResponse));
                return toObject;
            }
            function generateVideosOperationFromVertex$1(fromObject) {
                const toObject = {};
                const fromName = getValueByPath(fromObject, [
                    'name'
                ]);
                if (fromName != null) setValueByPath(toObject, [
                    'name'
                ], fromName);
                const fromMetadata = getValueByPath(fromObject, [
                    'metadata'
                ]);
                if (fromMetadata != null) setValueByPath(toObject, [
                    'metadata'
                ], fromMetadata);
                const fromDone = getValueByPath(fromObject, [
                    'done'
                ]);
                if (fromDone != null) setValueByPath(toObject, [
                    'done'
                ], fromDone);
                const fromError = getValueByPath(fromObject, [
                    'error'
                ]);
                if (fromError != null) setValueByPath(toObject, [
                    'error'
                ], fromError);
                const fromResponse = getValueByPath(fromObject, [
                    'response'
                ]);
                if (fromResponse != null) setValueByPath(toObject, [
                    'response'
                ], generateVideosResponseFromVertex$1(fromResponse));
                return toObject;
            }
            function generateVideosResponseFromMldev$1(fromObject) {
                const toObject = {};
                const fromGeneratedVideos = getValueByPath(fromObject, [
                    'generatedSamples'
                ]);
                if (fromGeneratedVideos != null) {
                    let transformedList = fromGeneratedVideos;
                    if (Array.isArray(transformedList)) transformedList = transformedList.map((item)=>{
                        return generatedVideoFromMldev$1(item);
                    });
                    setValueByPath(toObject, [
                        'generatedVideos'
                    ], transformedList);
                }
                const fromRaiMediaFilteredCount = getValueByPath(fromObject, [
                    'raiMediaFilteredCount'
                ]);
                if (fromRaiMediaFilteredCount != null) setValueByPath(toObject, [
                    'raiMediaFilteredCount'
                ], fromRaiMediaFilteredCount);
                const fromRaiMediaFilteredReasons = getValueByPath(fromObject, [
                    'raiMediaFilteredReasons'
                ]);
                if (fromRaiMediaFilteredReasons != null) setValueByPath(toObject, [
                    'raiMediaFilteredReasons'
                ], fromRaiMediaFilteredReasons);
                return toObject;
            }
            function generateVideosResponseFromVertex$1(fromObject) {
                const toObject = {};
                const fromGeneratedVideos = getValueByPath(fromObject, [
                    'videos'
                ]);
                if (fromGeneratedVideos != null) {
                    let transformedList = fromGeneratedVideos;
                    if (Array.isArray(transformedList)) transformedList = transformedList.map((item)=>{
                        return generatedVideoFromVertex$1(item);
                    });
                    setValueByPath(toObject, [
                        'generatedVideos'
                    ], transformedList);
                }
                const fromRaiMediaFilteredCount = getValueByPath(fromObject, [
                    'raiMediaFilteredCount'
                ]);
                if (fromRaiMediaFilteredCount != null) setValueByPath(toObject, [
                    'raiMediaFilteredCount'
                ], fromRaiMediaFilteredCount);
                const fromRaiMediaFilteredReasons = getValueByPath(fromObject, [
                    'raiMediaFilteredReasons'
                ]);
                if (fromRaiMediaFilteredReasons != null) setValueByPath(toObject, [
                    'raiMediaFilteredReasons'
                ], fromRaiMediaFilteredReasons);
                return toObject;
            }
            function generatedVideoFromMldev$1(fromObject) {
                const toObject = {};
                const fromVideo = getValueByPath(fromObject, [
                    'video'
                ]);
                if (fromVideo != null) setValueByPath(toObject, [
                    'video'
                ], videoFromMldev$1(fromVideo));
                return toObject;
            }
            function generatedVideoFromVertex$1(fromObject) {
                const toObject = {};
                const fromVideo = getValueByPath(fromObject, [
                    '_self'
                ]);
                if (fromVideo != null) setValueByPath(toObject, [
                    'video'
                ], videoFromVertex$1(fromVideo));
                return toObject;
            }
            function getOperationParametersToMldev(fromObject) {
                const toObject = {};
                const fromOperationName = getValueByPath(fromObject, [
                    'operationName'
                ]);
                if (fromOperationName != null) setValueByPath(toObject, [
                    '_url',
                    'operationName'
                ], fromOperationName);
                return toObject;
            }
            function getOperationParametersToVertex(fromObject) {
                const toObject = {};
                const fromOperationName = getValueByPath(fromObject, [
                    'operationName'
                ]);
                if (fromOperationName != null) setValueByPath(toObject, [
                    '_url',
                    'operationName'
                ], fromOperationName);
                return toObject;
            }
            function importFileOperationFromMldev$1(fromObject) {
                const toObject = {};
                const fromName = getValueByPath(fromObject, [
                    'name'
                ]);
                if (fromName != null) setValueByPath(toObject, [
                    'name'
                ], fromName);
                const fromMetadata = getValueByPath(fromObject, [
                    'metadata'
                ]);
                if (fromMetadata != null) setValueByPath(toObject, [
                    'metadata'
                ], fromMetadata);
                const fromDone = getValueByPath(fromObject, [
                    'done'
                ]);
                if (fromDone != null) setValueByPath(toObject, [
                    'done'
                ], fromDone);
                const fromError = getValueByPath(fromObject, [
                    'error'
                ]);
                if (fromError != null) setValueByPath(toObject, [
                    'error'
                ], fromError);
                const fromResponse = getValueByPath(fromObject, [
                    'response'
                ]);
                if (fromResponse != null) setValueByPath(toObject, [
                    'response'
                ], importFileResponseFromMldev$1(fromResponse));
                return toObject;
            }
            function importFileResponseFromMldev$1(fromObject) {
                const toObject = {};
                const fromSdkHttpResponse = getValueByPath(fromObject, [
                    'sdkHttpResponse'
                ]);
                if (fromSdkHttpResponse != null) setValueByPath(toObject, [
                    'sdkHttpResponse'
                ], fromSdkHttpResponse);
                const fromParent = getValueByPath(fromObject, [
                    'parent'
                ]);
                if (fromParent != null) setValueByPath(toObject, [
                    'parent'
                ], fromParent);
                const fromDocumentName = getValueByPath(fromObject, [
                    'documentName'
                ]);
                if (fromDocumentName != null) setValueByPath(toObject, [
                    'documentName'
                ], fromDocumentName);
                return toObject;
            }
            function uploadToFileSearchStoreOperationFromMldev(fromObject) {
                const toObject = {};
                const fromName = getValueByPath(fromObject, [
                    'name'
                ]);
                if (fromName != null) setValueByPath(toObject, [
                    'name'
                ], fromName);
                const fromMetadata = getValueByPath(fromObject, [
                    'metadata'
                ]);
                if (fromMetadata != null) setValueByPath(toObject, [
                    'metadata'
                ], fromMetadata);
                const fromDone = getValueByPath(fromObject, [
                    'done'
                ]);
                if (fromDone != null) setValueByPath(toObject, [
                    'done'
                ], fromDone);
                const fromError = getValueByPath(fromObject, [
                    'error'
                ]);
                if (fromError != null) setValueByPath(toObject, [
                    'error'
                ], fromError);
                const fromResponse = getValueByPath(fromObject, [
                    'response'
                ]);
                if (fromResponse != null) setValueByPath(toObject, [
                    'response'
                ], uploadToFileSearchStoreResponseFromMldev(fromResponse));
                return toObject;
            }
            function uploadToFileSearchStoreResponseFromMldev(fromObject) {
                const toObject = {};
                const fromSdkHttpResponse = getValueByPath(fromObject, [
                    'sdkHttpResponse'
                ]);
                if (fromSdkHttpResponse != null) setValueByPath(toObject, [
                    'sdkHttpResponse'
                ], fromSdkHttpResponse);
                const fromParent = getValueByPath(fromObject, [
                    'parent'
                ]);
                if (fromParent != null) setValueByPath(toObject, [
                    'parent'
                ], fromParent);
                const fromDocumentName = getValueByPath(fromObject, [
                    'documentName'
                ]);
                if (fromDocumentName != null) setValueByPath(toObject, [
                    'documentName'
                ], fromDocumentName);
                return toObject;
            }
            function videoFromMldev$1(fromObject) {
                const toObject = {};
                const fromUri = getValueByPath(fromObject, [
                    'uri'
                ]);
                if (fromUri != null) setValueByPath(toObject, [
                    'uri'
                ], fromUri);
                const fromVideoBytes = getValueByPath(fromObject, [
                    'encodedVideo'
                ]);
                if (fromVideoBytes != null) setValueByPath(toObject, [
                    'videoBytes'
                ], tBytes$1(fromVideoBytes));
                const fromMimeType = getValueByPath(fromObject, [
                    'encoding'
                ]);
                if (fromMimeType != null) setValueByPath(toObject, [
                    'mimeType'
                ], fromMimeType);
                return toObject;
            }
            function videoFromVertex$1(fromObject) {
                const toObject = {};
                const fromUri = getValueByPath(fromObject, [
                    'gcsUri'
                ]);
                if (fromUri != null) setValueByPath(toObject, [
                    'uri'
                ], fromUri);
                const fromVideoBytes = getValueByPath(fromObject, [
                    'bytesBase64Encoded'
                ]);
                if (fromVideoBytes != null) setValueByPath(toObject, [
                    'videoBytes'
                ], tBytes$1(fromVideoBytes));
                const fromMimeType = getValueByPath(fromObject, [
                    'mimeType'
                ]);
                if (fromMimeType != null) setValueByPath(toObject, [
                    'mimeType'
                ], fromMimeType);
                return toObject;
            }
            var Outcome;
            (function(Outcome) {
                Outcome["OUTCOME_UNSPECIFIED"] = "OUTCOME_UNSPECIFIED";
                Outcome["OUTCOME_OK"] = "OUTCOME_OK";
                Outcome["OUTCOME_FAILED"] = "OUTCOME_FAILED";
                Outcome["OUTCOME_DEADLINE_EXCEEDED"] = "OUTCOME_DEADLINE_EXCEEDED";
            })(Outcome || (Outcome = {}));
            var Language;
            (function(Language) {
                Language["LANGUAGE_UNSPECIFIED"] = "LANGUAGE_UNSPECIFIED";
                Language["PYTHON"] = "PYTHON";
            })(Language || (Language = {}));
            var FunctionResponseScheduling;
            (function(FunctionResponseScheduling) {
                FunctionResponseScheduling["SCHEDULING_UNSPECIFIED"] = "SCHEDULING_UNSPECIFIED";
                FunctionResponseScheduling["SILENT"] = "SILENT";
                FunctionResponseScheduling["WHEN_IDLE"] = "WHEN_IDLE";
                FunctionResponseScheduling["INTERRUPT"] = "INTERRUPT";
            })(FunctionResponseScheduling || (FunctionResponseScheduling = {}));
            var Type;
            (function(Type) {
                Type["TYPE_UNSPECIFIED"] = "TYPE_UNSPECIFIED";
                Type["STRING"] = "STRING";
                Type["NUMBER"] = "NUMBER";
                Type["INTEGER"] = "INTEGER";
                Type["BOOLEAN"] = "BOOLEAN";
                Type["ARRAY"] = "ARRAY";
                Type["OBJECT"] = "OBJECT";
                Type["NULL"] = "NULL";
            })(Type || (Type = {}));
            var Mode;
            (function(Mode) {
                Mode["MODE_UNSPECIFIED"] = "MODE_UNSPECIFIED";
                Mode["MODE_DYNAMIC"] = "MODE_DYNAMIC";
            })(Mode || (Mode = {}));
            var ApiSpec;
            (function(ApiSpec) {
                ApiSpec["API_SPEC_UNSPECIFIED"] = "API_SPEC_UNSPECIFIED";
                ApiSpec["SIMPLE_SEARCH"] = "SIMPLE_SEARCH";
                ApiSpec["ELASTIC_SEARCH"] = "ELASTIC_SEARCH";
            })(ApiSpec || (ApiSpec = {}));
            var AuthType;
            (function(AuthType) {
                AuthType["AUTH_TYPE_UNSPECIFIED"] = "AUTH_TYPE_UNSPECIFIED";
                AuthType["NO_AUTH"] = "NO_AUTH";
                AuthType["API_KEY_AUTH"] = "API_KEY_AUTH";
                AuthType["HTTP_BASIC_AUTH"] = "HTTP_BASIC_AUTH";
                AuthType["GOOGLE_SERVICE_ACCOUNT_AUTH"] = "GOOGLE_SERVICE_ACCOUNT_AUTH";
                AuthType["OAUTH"] = "OAUTH";
                AuthType["OIDC_AUTH"] = "OIDC_AUTH";
            })(AuthType || (AuthType = {}));
            var HttpElementLocation;
            (function(HttpElementLocation) {
                HttpElementLocation["HTTP_IN_UNSPECIFIED"] = "HTTP_IN_UNSPECIFIED";
                HttpElementLocation["HTTP_IN_QUERY"] = "HTTP_IN_QUERY";
                HttpElementLocation["HTTP_IN_HEADER"] = "HTTP_IN_HEADER";
                HttpElementLocation["HTTP_IN_PATH"] = "HTTP_IN_PATH";
                HttpElementLocation["HTTP_IN_BODY"] = "HTTP_IN_BODY";
                HttpElementLocation["HTTP_IN_COOKIE"] = "HTTP_IN_COOKIE";
            })(HttpElementLocation || (HttpElementLocation = {}));
            var PhishBlockThreshold;
            (function(PhishBlockThreshold) {
                PhishBlockThreshold["PHISH_BLOCK_THRESHOLD_UNSPECIFIED"] = "PHISH_BLOCK_THRESHOLD_UNSPECIFIED";
                PhishBlockThreshold["BLOCK_LOW_AND_ABOVE"] = "BLOCK_LOW_AND_ABOVE";
                PhishBlockThreshold["BLOCK_MEDIUM_AND_ABOVE"] = "BLOCK_MEDIUM_AND_ABOVE";
                PhishBlockThreshold["BLOCK_HIGH_AND_ABOVE"] = "BLOCK_HIGH_AND_ABOVE";
                PhishBlockThreshold["BLOCK_HIGHER_AND_ABOVE"] = "BLOCK_HIGHER_AND_ABOVE";
                PhishBlockThreshold["BLOCK_VERY_HIGH_AND_ABOVE"] = "BLOCK_VERY_HIGH_AND_ABOVE";
                PhishBlockThreshold["BLOCK_ONLY_EXTREMELY_HIGH"] = "BLOCK_ONLY_EXTREMELY_HIGH";
            })(PhishBlockThreshold || (PhishBlockThreshold = {}));
            var ThinkingLevel;
            (function(ThinkingLevel) {
                ThinkingLevel["THINKING_LEVEL_UNSPECIFIED"] = "THINKING_LEVEL_UNSPECIFIED";
                ThinkingLevel["LOW"] = "LOW";
                ThinkingLevel["MEDIUM"] = "MEDIUM";
                ThinkingLevel["HIGH"] = "HIGH";
                ThinkingLevel["MINIMAL"] = "MINIMAL";
            })(ThinkingLevel || (ThinkingLevel = {}));
            var HarmCategory;
            (function(HarmCategory) {
                HarmCategory["HARM_CATEGORY_UNSPECIFIED"] = "HARM_CATEGORY_UNSPECIFIED";
                HarmCategory["HARM_CATEGORY_HARASSMENT"] = "HARM_CATEGORY_HARASSMENT";
                HarmCategory["HARM_CATEGORY_HATE_SPEECH"] = "HARM_CATEGORY_HATE_SPEECH";
                HarmCategory["HARM_CATEGORY_SEXUALLY_EXPLICIT"] = "HARM_CATEGORY_SEXUALLY_EXPLICIT";
                HarmCategory["HARM_CATEGORY_DANGEROUS_CONTENT"] = "HARM_CATEGORY_DANGEROUS_CONTENT";
                HarmCategory["HARM_CATEGORY_CIVIC_INTEGRITY"] = "HARM_CATEGORY_CIVIC_INTEGRITY";
                HarmCategory["HARM_CATEGORY_IMAGE_HATE"] = "HARM_CATEGORY_IMAGE_HATE";
                HarmCategory["HARM_CATEGORY_IMAGE_DANGEROUS_CONTENT"] = "HARM_CATEGORY_IMAGE_DANGEROUS_CONTENT";
                HarmCategory["HARM_CATEGORY_IMAGE_HARASSMENT"] = "HARM_CATEGORY_IMAGE_HARASSMENT";
                HarmCategory["HARM_CATEGORY_IMAGE_SEXUALLY_EXPLICIT"] = "HARM_CATEGORY_IMAGE_SEXUALLY_EXPLICIT";
                HarmCategory["HARM_CATEGORY_JAILBREAK"] = "HARM_CATEGORY_JAILBREAK";
            })(HarmCategory || (HarmCategory = {}));
            var HarmBlockMethod;
            (function(HarmBlockMethod) {
                HarmBlockMethod["HARM_BLOCK_METHOD_UNSPECIFIED"] = "HARM_BLOCK_METHOD_UNSPECIFIED";
                HarmBlockMethod["SEVERITY"] = "SEVERITY";
                HarmBlockMethod["PROBABILITY"] = "PROBABILITY";
            })(HarmBlockMethod || (HarmBlockMethod = {}));
            var HarmBlockThreshold;
            (function(HarmBlockThreshold) {
                HarmBlockThreshold["HARM_BLOCK_THRESHOLD_UNSPECIFIED"] = "HARM_BLOCK_THRESHOLD_UNSPECIFIED";
                HarmBlockThreshold["BLOCK_LOW_AND_ABOVE"] = "BLOCK_LOW_AND_ABOVE";
                HarmBlockThreshold["BLOCK_MEDIUM_AND_ABOVE"] = "BLOCK_MEDIUM_AND_ABOVE";
                HarmBlockThreshold["BLOCK_ONLY_HIGH"] = "BLOCK_ONLY_HIGH";
                HarmBlockThreshold["BLOCK_NONE"] = "BLOCK_NONE";
                HarmBlockThreshold["OFF"] = "OFF";
            })(HarmBlockThreshold || (HarmBlockThreshold = {}));
            var FinishReason;
            (function(FinishReason) {
                FinishReason["FINISH_REASON_UNSPECIFIED"] = "FINISH_REASON_UNSPECIFIED";
                FinishReason["STOP"] = "STOP";
                FinishReason["MAX_TOKENS"] = "MAX_TOKENS";
                FinishReason["SAFETY"] = "SAFETY";
                FinishReason["RECITATION"] = "RECITATION";
                FinishReason["LANGUAGE"] = "LANGUAGE";
                FinishReason["OTHER"] = "OTHER";
                FinishReason["BLOCKLIST"] = "BLOCKLIST";
                FinishReason["PROHIBITED_CONTENT"] = "PROHIBITED_CONTENT";
                FinishReason["SPII"] = "SPII";
                FinishReason["MALFORMED_FUNCTION_CALL"] = "MALFORMED_FUNCTION_CALL";
                FinishReason["IMAGE_SAFETY"] = "IMAGE_SAFETY";
                FinishReason["UNEXPECTED_TOOL_CALL"] = "UNEXPECTED_TOOL_CALL";
                FinishReason["IMAGE_PROHIBITED_CONTENT"] = "IMAGE_PROHIBITED_CONTENT";
                FinishReason["NO_IMAGE"] = "NO_IMAGE";
                FinishReason["IMAGE_RECITATION"] = "IMAGE_RECITATION";
                FinishReason["IMAGE_OTHER"] = "IMAGE_OTHER";
            })(FinishReason || (FinishReason = {}));
            var HarmProbability;
            (function(HarmProbability) {
                HarmProbability["HARM_PROBABILITY_UNSPECIFIED"] = "HARM_PROBABILITY_UNSPECIFIED";
                HarmProbability["NEGLIGIBLE"] = "NEGLIGIBLE";
                HarmProbability["LOW"] = "LOW";
                HarmProbability["MEDIUM"] = "MEDIUM";
                HarmProbability["HIGH"] = "HIGH";
            })(HarmProbability || (HarmProbability = {}));
            var HarmSeverity;
            (function(HarmSeverity) {
                HarmSeverity["HARM_SEVERITY_UNSPECIFIED"] = "HARM_SEVERITY_UNSPECIFIED";
                HarmSeverity["HARM_SEVERITY_NEGLIGIBLE"] = "HARM_SEVERITY_NEGLIGIBLE";
                HarmSeverity["HARM_SEVERITY_LOW"] = "HARM_SEVERITY_LOW";
                HarmSeverity["HARM_SEVERITY_MEDIUM"] = "HARM_SEVERITY_MEDIUM";
                HarmSeverity["HARM_SEVERITY_HIGH"] = "HARM_SEVERITY_HIGH";
            })(HarmSeverity || (HarmSeverity = {}));
            var UrlRetrievalStatus;
            (function(UrlRetrievalStatus) {
                UrlRetrievalStatus["URL_RETRIEVAL_STATUS_UNSPECIFIED"] = "URL_RETRIEVAL_STATUS_UNSPECIFIED";
                UrlRetrievalStatus["URL_RETRIEVAL_STATUS_SUCCESS"] = "URL_RETRIEVAL_STATUS_SUCCESS";
                UrlRetrievalStatus["URL_RETRIEVAL_STATUS_ERROR"] = "URL_RETRIEVAL_STATUS_ERROR";
                UrlRetrievalStatus["URL_RETRIEVAL_STATUS_PAYWALL"] = "URL_RETRIEVAL_STATUS_PAYWALL";
                UrlRetrievalStatus["URL_RETRIEVAL_STATUS_UNSAFE"] = "URL_RETRIEVAL_STATUS_UNSAFE";
            })(UrlRetrievalStatus || (UrlRetrievalStatus = {}));
            var BlockedReason;
            (function(BlockedReason) {
                BlockedReason["BLOCKED_REASON_UNSPECIFIED"] = "BLOCKED_REASON_UNSPECIFIED";
                BlockedReason["SAFETY"] = "SAFETY";
                BlockedReason["OTHER"] = "OTHER";
                BlockedReason["BLOCKLIST"] = "BLOCKLIST";
                BlockedReason["PROHIBITED_CONTENT"] = "PROHIBITED_CONTENT";
                BlockedReason["IMAGE_SAFETY"] = "IMAGE_SAFETY";
                BlockedReason["MODEL_ARMOR"] = "MODEL_ARMOR";
                BlockedReason["JAILBREAK"] = "JAILBREAK";
            })(BlockedReason || (BlockedReason = {}));
            var TrafficType;
            (function(TrafficType) {
                TrafficType["TRAFFIC_TYPE_UNSPECIFIED"] = "TRAFFIC_TYPE_UNSPECIFIED";
                TrafficType["ON_DEMAND"] = "ON_DEMAND";
                TrafficType["PROVISIONED_THROUGHPUT"] = "PROVISIONED_THROUGHPUT";
            })(TrafficType || (TrafficType = {}));
            var Modality;
            (function(Modality) {
                Modality["MODALITY_UNSPECIFIED"] = "MODALITY_UNSPECIFIED";
                Modality["TEXT"] = "TEXT";
                Modality["IMAGE"] = "IMAGE";
                Modality["AUDIO"] = "AUDIO";
            })(Modality || (Modality = {}));
            var MediaResolution;
            (function(MediaResolution) {
                MediaResolution["MEDIA_RESOLUTION_UNSPECIFIED"] = "MEDIA_RESOLUTION_UNSPECIFIED";
                MediaResolution["MEDIA_RESOLUTION_LOW"] = "MEDIA_RESOLUTION_LOW";
                MediaResolution["MEDIA_RESOLUTION_MEDIUM"] = "MEDIA_RESOLUTION_MEDIUM";
                MediaResolution["MEDIA_RESOLUTION_HIGH"] = "MEDIA_RESOLUTION_HIGH";
            })(MediaResolution || (MediaResolution = {}));
            var TuningMode;
            (function(TuningMode) {
                TuningMode["TUNING_MODE_UNSPECIFIED"] = "TUNING_MODE_UNSPECIFIED";
                TuningMode["TUNING_MODE_FULL"] = "TUNING_MODE_FULL";
                TuningMode["TUNING_MODE_PEFT_ADAPTER"] = "TUNING_MODE_PEFT_ADAPTER";
            })(TuningMode || (TuningMode = {}));
            var AdapterSize;
            (function(AdapterSize) {
                AdapterSize["ADAPTER_SIZE_UNSPECIFIED"] = "ADAPTER_SIZE_UNSPECIFIED";
                AdapterSize["ADAPTER_SIZE_ONE"] = "ADAPTER_SIZE_ONE";
                AdapterSize["ADAPTER_SIZE_TWO"] = "ADAPTER_SIZE_TWO";
                AdapterSize["ADAPTER_SIZE_FOUR"] = "ADAPTER_SIZE_FOUR";
                AdapterSize["ADAPTER_SIZE_EIGHT"] = "ADAPTER_SIZE_EIGHT";
                AdapterSize["ADAPTER_SIZE_SIXTEEN"] = "ADAPTER_SIZE_SIXTEEN";
                AdapterSize["ADAPTER_SIZE_THIRTY_TWO"] = "ADAPTER_SIZE_THIRTY_TWO";
            })(AdapterSize || (AdapterSize = {}));
            var JobState;
            (function(JobState) {
                JobState["JOB_STATE_UNSPECIFIED"] = "JOB_STATE_UNSPECIFIED";
                JobState["JOB_STATE_QUEUED"] = "JOB_STATE_QUEUED";
                JobState["JOB_STATE_PENDING"] = "JOB_STATE_PENDING";
                JobState["JOB_STATE_RUNNING"] = "JOB_STATE_RUNNING";
                JobState["JOB_STATE_SUCCEEDED"] = "JOB_STATE_SUCCEEDED";
                JobState["JOB_STATE_FAILED"] = "JOB_STATE_FAILED";
                JobState["JOB_STATE_CANCELLING"] = "JOB_STATE_CANCELLING";
                JobState["JOB_STATE_CANCELLED"] = "JOB_STATE_CANCELLED";
                JobState["JOB_STATE_PAUSED"] = "JOB_STATE_PAUSED";
                JobState["JOB_STATE_EXPIRED"] = "JOB_STATE_EXPIRED";
                JobState["JOB_STATE_UPDATING"] = "JOB_STATE_UPDATING";
                JobState["JOB_STATE_PARTIALLY_SUCCEEDED"] = "JOB_STATE_PARTIALLY_SUCCEEDED";
            })(JobState || (JobState = {}));
            var TuningTask;
            (function(TuningTask) {
                TuningTask["TUNING_TASK_UNSPECIFIED"] = "TUNING_TASK_UNSPECIFIED";
                TuningTask["TUNING_TASK_I2V"] = "TUNING_TASK_I2V";
                TuningTask["TUNING_TASK_T2V"] = "TUNING_TASK_T2V";
                TuningTask["TUNING_TASK_R2V"] = "TUNING_TASK_R2V";
            })(TuningTask || (TuningTask = {}));
            var PartMediaResolutionLevel;
            (function(PartMediaResolutionLevel) {
                PartMediaResolutionLevel["MEDIA_RESOLUTION_UNSPECIFIED"] = "MEDIA_RESOLUTION_UNSPECIFIED";
                PartMediaResolutionLevel["MEDIA_RESOLUTION_LOW"] = "MEDIA_RESOLUTION_LOW";
                PartMediaResolutionLevel["MEDIA_RESOLUTION_MEDIUM"] = "MEDIA_RESOLUTION_MEDIUM";
                PartMediaResolutionLevel["MEDIA_RESOLUTION_HIGH"] = "MEDIA_RESOLUTION_HIGH";
                PartMediaResolutionLevel["MEDIA_RESOLUTION_ULTRA_HIGH"] = "MEDIA_RESOLUTION_ULTRA_HIGH";
            })(PartMediaResolutionLevel || (PartMediaResolutionLevel = {}));
            var FeatureSelectionPreference;
            (function(FeatureSelectionPreference) {
                FeatureSelectionPreference["FEATURE_SELECTION_PREFERENCE_UNSPECIFIED"] = "FEATURE_SELECTION_PREFERENCE_UNSPECIFIED";
                FeatureSelectionPreference["PRIORITIZE_QUALITY"] = "PRIORITIZE_QUALITY";
                FeatureSelectionPreference["BALANCED"] = "BALANCED";
                FeatureSelectionPreference["PRIORITIZE_COST"] = "PRIORITIZE_COST";
            })(FeatureSelectionPreference || (FeatureSelectionPreference = {}));
            var Behavior;
            (function(Behavior) {
                Behavior["UNSPECIFIED"] = "UNSPECIFIED";
                Behavior["BLOCKING"] = "BLOCKING";
                Behavior["NON_BLOCKING"] = "NON_BLOCKING";
            })(Behavior || (Behavior = {}));
            var DynamicRetrievalConfigMode;
            (function(DynamicRetrievalConfigMode) {
                DynamicRetrievalConfigMode["MODE_UNSPECIFIED"] = "MODE_UNSPECIFIED";
                DynamicRetrievalConfigMode["MODE_DYNAMIC"] = "MODE_DYNAMIC";
            })(DynamicRetrievalConfigMode || (DynamicRetrievalConfigMode = {}));
            var Environment;
            (function(Environment) {
                Environment["ENVIRONMENT_UNSPECIFIED"] = "ENVIRONMENT_UNSPECIFIED";
                Environment["ENVIRONMENT_BROWSER"] = "ENVIRONMENT_BROWSER";
            })(Environment || (Environment = {}));
            var FunctionCallingConfigMode;
            (function(FunctionCallingConfigMode) {
                FunctionCallingConfigMode["MODE_UNSPECIFIED"] = "MODE_UNSPECIFIED";
                FunctionCallingConfigMode["AUTO"] = "AUTO";
                FunctionCallingConfigMode["ANY"] = "ANY";
                FunctionCallingConfigMode["NONE"] = "NONE";
                FunctionCallingConfigMode["VALIDATED"] = "VALIDATED";
            })(FunctionCallingConfigMode || (FunctionCallingConfigMode = {}));
            var SafetyFilterLevel;
            (function(SafetyFilterLevel) {
                SafetyFilterLevel["BLOCK_LOW_AND_ABOVE"] = "BLOCK_LOW_AND_ABOVE";
                SafetyFilterLevel["BLOCK_MEDIUM_AND_ABOVE"] = "BLOCK_MEDIUM_AND_ABOVE";
                SafetyFilterLevel["BLOCK_ONLY_HIGH"] = "BLOCK_ONLY_HIGH";
                SafetyFilterLevel["BLOCK_NONE"] = "BLOCK_NONE";
            })(SafetyFilterLevel || (SafetyFilterLevel = {}));
            var PersonGeneration;
            (function(PersonGeneration) {
                PersonGeneration["DONT_ALLOW"] = "DONT_ALLOW";
                PersonGeneration["ALLOW_ADULT"] = "ALLOW_ADULT";
                PersonGeneration["ALLOW_ALL"] = "ALLOW_ALL";
            })(PersonGeneration || (PersonGeneration = {}));
            var ImagePromptLanguage;
            (function(ImagePromptLanguage) {
                ImagePromptLanguage["auto"] = "auto";
                ImagePromptLanguage["en"] = "en";
                ImagePromptLanguage["ja"] = "ja";
                ImagePromptLanguage["ko"] = "ko";
                ImagePromptLanguage["hi"] = "hi";
                ImagePromptLanguage["zh"] = "zh";
                ImagePromptLanguage["pt"] = "pt";
                ImagePromptLanguage["es"] = "es";
            })(ImagePromptLanguage || (ImagePromptLanguage = {}));
            var MaskReferenceMode;
            (function(MaskReferenceMode) {
                MaskReferenceMode["MASK_MODE_DEFAULT"] = "MASK_MODE_DEFAULT";
                MaskReferenceMode["MASK_MODE_USER_PROVIDED"] = "MASK_MODE_USER_PROVIDED";
                MaskReferenceMode["MASK_MODE_BACKGROUND"] = "MASK_MODE_BACKGROUND";
                MaskReferenceMode["MASK_MODE_FOREGROUND"] = "MASK_MODE_FOREGROUND";
                MaskReferenceMode["MASK_MODE_SEMANTIC"] = "MASK_MODE_SEMANTIC";
            })(MaskReferenceMode || (MaskReferenceMode = {}));
            var ControlReferenceType;
            (function(ControlReferenceType) {
                ControlReferenceType["CONTROL_TYPE_DEFAULT"] = "CONTROL_TYPE_DEFAULT";
                ControlReferenceType["CONTROL_TYPE_CANNY"] = "CONTROL_TYPE_CANNY";
                ControlReferenceType["CONTROL_TYPE_SCRIBBLE"] = "CONTROL_TYPE_SCRIBBLE";
                ControlReferenceType["CONTROL_TYPE_FACE_MESH"] = "CONTROL_TYPE_FACE_MESH";
            })(ControlReferenceType || (ControlReferenceType = {}));
            var SubjectReferenceType;
            (function(SubjectReferenceType) {
                SubjectReferenceType["SUBJECT_TYPE_DEFAULT"] = "SUBJECT_TYPE_DEFAULT";
                SubjectReferenceType["SUBJECT_TYPE_PERSON"] = "SUBJECT_TYPE_PERSON";
                SubjectReferenceType["SUBJECT_TYPE_ANIMAL"] = "SUBJECT_TYPE_ANIMAL";
                SubjectReferenceType["SUBJECT_TYPE_PRODUCT"] = "SUBJECT_TYPE_PRODUCT";
            })(SubjectReferenceType || (SubjectReferenceType = {}));
            var EditMode;
            (function(EditMode) {
                EditMode["EDIT_MODE_DEFAULT"] = "EDIT_MODE_DEFAULT";
                EditMode["EDIT_MODE_INPAINT_REMOVAL"] = "EDIT_MODE_INPAINT_REMOVAL";
                EditMode["EDIT_MODE_INPAINT_INSERTION"] = "EDIT_MODE_INPAINT_INSERTION";
                EditMode["EDIT_MODE_OUTPAINT"] = "EDIT_MODE_OUTPAINT";
                EditMode["EDIT_MODE_CONTROLLED_EDITING"] = "EDIT_MODE_CONTROLLED_EDITING";
                EditMode["EDIT_MODE_STYLE"] = "EDIT_MODE_STYLE";
                EditMode["EDIT_MODE_BGSWAP"] = "EDIT_MODE_BGSWAP";
                EditMode["EDIT_MODE_PRODUCT_IMAGE"] = "EDIT_MODE_PRODUCT_IMAGE";
            })(EditMode || (EditMode = {}));
            var SegmentMode;
            (function(SegmentMode) {
                SegmentMode["FOREGROUND"] = "FOREGROUND";
                SegmentMode["BACKGROUND"] = "BACKGROUND";
                SegmentMode["PROMPT"] = "PROMPT";
                SegmentMode["SEMANTIC"] = "SEMANTIC";
                SegmentMode["INTERACTIVE"] = "INTERACTIVE";
            })(SegmentMode || (SegmentMode = {}));
            var VideoGenerationReferenceType;
            (function(VideoGenerationReferenceType) {
                VideoGenerationReferenceType["ASSET"] = "ASSET";
                VideoGenerationReferenceType["STYLE"] = "STYLE";
            })(VideoGenerationReferenceType || (VideoGenerationReferenceType = {}));
            var VideoGenerationMaskMode;
            (function(VideoGenerationMaskMode) {
                VideoGenerationMaskMode["INSERT"] = "INSERT";
                VideoGenerationMaskMode["REMOVE"] = "REMOVE";
                VideoGenerationMaskMode["REMOVE_STATIC"] = "REMOVE_STATIC";
                VideoGenerationMaskMode["OUTPAINT"] = "OUTPAINT";
            })(VideoGenerationMaskMode || (VideoGenerationMaskMode = {}));
            var VideoCompressionQuality;
            (function(VideoCompressionQuality) {
                VideoCompressionQuality["OPTIMIZED"] = "OPTIMIZED";
                VideoCompressionQuality["LOSSLESS"] = "LOSSLESS";
            })(VideoCompressionQuality || (VideoCompressionQuality = {}));
            var TuningMethod;
            (function(TuningMethod) {
                TuningMethod["SUPERVISED_FINE_TUNING"] = "SUPERVISED_FINE_TUNING";
                TuningMethod["PREFERENCE_TUNING"] = "PREFERENCE_TUNING";
            })(TuningMethod || (TuningMethod = {}));
            var DocumentState;
            (function(DocumentState) {
                DocumentState["STATE_UNSPECIFIED"] = "STATE_UNSPECIFIED";
                DocumentState["STATE_PENDING"] = "STATE_PENDING";
                DocumentState["STATE_ACTIVE"] = "STATE_ACTIVE";
                DocumentState["STATE_FAILED"] = "STATE_FAILED";
            })(DocumentState || (DocumentState = {}));
            var FileState;
            (function(FileState) {
                FileState["STATE_UNSPECIFIED"] = "STATE_UNSPECIFIED";
                FileState["PROCESSING"] = "PROCESSING";
                FileState["ACTIVE"] = "ACTIVE";
                FileState["FAILED"] = "FAILED";
            })(FileState || (FileState = {}));
            var FileSource;
            (function(FileSource) {
                FileSource["SOURCE_UNSPECIFIED"] = "SOURCE_UNSPECIFIED";
                FileSource["UPLOADED"] = "UPLOADED";
                FileSource["GENERATED"] = "GENERATED";
            })(FileSource || (FileSource = {}));
            var TurnCompleteReason;
            (function(TurnCompleteReason) {
                TurnCompleteReason["TURN_COMPLETE_REASON_UNSPECIFIED"] = "TURN_COMPLETE_REASON_UNSPECIFIED";
                TurnCompleteReason["MALFORMED_FUNCTION_CALL"] = "MALFORMED_FUNCTION_CALL";
                TurnCompleteReason["RESPONSE_REJECTED"] = "RESPONSE_REJECTED";
                TurnCompleteReason["NEED_MORE_INPUT"] = "NEED_MORE_INPUT";
            })(TurnCompleteReason || (TurnCompleteReason = {}));
            var MediaModality;
            (function(MediaModality) {
                MediaModality["MODALITY_UNSPECIFIED"] = "MODALITY_UNSPECIFIED";
                MediaModality["TEXT"] = "TEXT";
                MediaModality["IMAGE"] = "IMAGE";
                MediaModality["VIDEO"] = "VIDEO";
                MediaModality["AUDIO"] = "AUDIO";
                MediaModality["DOCUMENT"] = "DOCUMENT";
            })(MediaModality || (MediaModality = {}));
            var VadSignalType;
            (function(VadSignalType) {
                VadSignalType["VAD_SIGNAL_TYPE_UNSPECIFIED"] = "VAD_SIGNAL_TYPE_UNSPECIFIED";
                VadSignalType["VAD_SIGNAL_TYPE_SOS"] = "VAD_SIGNAL_TYPE_SOS";
                VadSignalType["VAD_SIGNAL_TYPE_EOS"] = "VAD_SIGNAL_TYPE_EOS";
            })(VadSignalType || (VadSignalType = {}));
            var StartSensitivity;
            (function(StartSensitivity) {
                StartSensitivity["START_SENSITIVITY_UNSPECIFIED"] = "START_SENSITIVITY_UNSPECIFIED";
                StartSensitivity["START_SENSITIVITY_HIGH"] = "START_SENSITIVITY_HIGH";
                StartSensitivity["START_SENSITIVITY_LOW"] = "START_SENSITIVITY_LOW";
            })(StartSensitivity || (StartSensitivity = {}));
            var EndSensitivity;
            (function(EndSensitivity) {
                EndSensitivity["END_SENSITIVITY_UNSPECIFIED"] = "END_SENSITIVITY_UNSPECIFIED";
                EndSensitivity["END_SENSITIVITY_HIGH"] = "END_SENSITIVITY_HIGH";
                EndSensitivity["END_SENSITIVITY_LOW"] = "END_SENSITIVITY_LOW";
            })(EndSensitivity || (EndSensitivity = {}));
            var ActivityHandling;
            (function(ActivityHandling) {
                ActivityHandling["ACTIVITY_HANDLING_UNSPECIFIED"] = "ACTIVITY_HANDLING_UNSPECIFIED";
                ActivityHandling["START_OF_ACTIVITY_INTERRUPTS"] = "START_OF_ACTIVITY_INTERRUPTS";
                ActivityHandling["NO_INTERRUPTION"] = "NO_INTERRUPTION";
            })(ActivityHandling || (ActivityHandling = {}));
            var TurnCoverage;
            (function(TurnCoverage) {
                TurnCoverage["TURN_COVERAGE_UNSPECIFIED"] = "TURN_COVERAGE_UNSPECIFIED";
                TurnCoverage["TURN_INCLUDES_ONLY_ACTIVITY"] = "TURN_INCLUDES_ONLY_ACTIVITY";
                TurnCoverage["TURN_INCLUDES_ALL_INPUT"] = "TURN_INCLUDES_ALL_INPUT";
            })(TurnCoverage || (TurnCoverage = {}));
            var Scale;
            (function(Scale) {
                Scale["SCALE_UNSPECIFIED"] = "SCALE_UNSPECIFIED";
                Scale["C_MAJOR_A_MINOR"] = "C_MAJOR_A_MINOR";
                Scale["D_FLAT_MAJOR_B_FLAT_MINOR"] = "D_FLAT_MAJOR_B_FLAT_MINOR";
                Scale["D_MAJOR_B_MINOR"] = "D_MAJOR_B_MINOR";
                Scale["E_FLAT_MAJOR_C_MINOR"] = "E_FLAT_MAJOR_C_MINOR";
                Scale["E_MAJOR_D_FLAT_MINOR"] = "E_MAJOR_D_FLAT_MINOR";
                Scale["F_MAJOR_D_MINOR"] = "F_MAJOR_D_MINOR";
                Scale["G_FLAT_MAJOR_E_FLAT_MINOR"] = "G_FLAT_MAJOR_E_FLAT_MINOR";
                Scale["G_MAJOR_E_MINOR"] = "G_MAJOR_E_MINOR";
                Scale["A_FLAT_MAJOR_F_MINOR"] = "A_FLAT_MAJOR_F_MINOR";
                Scale["A_MAJOR_G_FLAT_MINOR"] = "A_MAJOR_G_FLAT_MINOR";
                Scale["B_FLAT_MAJOR_G_MINOR"] = "B_FLAT_MAJOR_G_MINOR";
                Scale["B_MAJOR_A_FLAT_MINOR"] = "B_MAJOR_A_FLAT_MINOR";
            })(Scale || (Scale = {}));
            var MusicGenerationMode;
            (function(MusicGenerationMode) {
                MusicGenerationMode["MUSIC_GENERATION_MODE_UNSPECIFIED"] = "MUSIC_GENERATION_MODE_UNSPECIFIED";
                MusicGenerationMode["QUALITY"] = "QUALITY";
                MusicGenerationMode["DIVERSITY"] = "DIVERSITY";
                MusicGenerationMode["VOCALIZATION"] = "VOCALIZATION";
            })(MusicGenerationMode || (MusicGenerationMode = {}));
            var LiveMusicPlaybackControl;
            (function(LiveMusicPlaybackControl) {
                LiveMusicPlaybackControl["PLAYBACK_CONTROL_UNSPECIFIED"] = "PLAYBACK_CONTROL_UNSPECIFIED";
                LiveMusicPlaybackControl["PLAY"] = "PLAY";
                LiveMusicPlaybackControl["PAUSE"] = "PAUSE";
                LiveMusicPlaybackControl["STOP"] = "STOP";
                LiveMusicPlaybackControl["RESET_CONTEXT"] = "RESET_CONTEXT";
            })(LiveMusicPlaybackControl || (LiveMusicPlaybackControl = {}));
            class FunctionResponseBlob {
            }
            class FunctionResponseFileData {
            }
            class FunctionResponsePart {
            }
            function createFunctionResponsePartFromBase64(data, mimeType) {
                return {
                    inlineData: {
                        data: data,
                        mimeType: mimeType
                    }
                };
            }
            function createFunctionResponsePartFromUri(uri, mimeType) {
                return {
                    fileData: {
                        fileUri: uri,
                        mimeType: mimeType
                    }
                };
            }
            class FunctionResponse {
            }
            function createPartFromUri(uri, mimeType, mediaResolution) {
                return Object.assign({
                    fileData: {
                        fileUri: uri,
                        mimeType: mimeType
                    }
                }, mediaResolution && {
                    mediaResolution: {
                        level: mediaResolution
                    }
                });
            }
            function createPartFromText(text) {
                return {
                    text: text
                };
            }
            function createPartFromFunctionCall(name, args) {
                return {
                    functionCall: {
                        name: name,
                        args: args
                    }
                };
            }
            function createPartFromFunctionResponse(id, name, response, parts = []) {
                return {
                    functionResponse: Object.assign({
                        id: id,
                        name: name,
                        response: response
                    }, parts.length > 0 && {
                        parts
                    })
                };
            }
            function createPartFromBase64(data, mimeType, mediaResolution) {
                return Object.assign({
                    inlineData: {
                        data: data,
                        mimeType: mimeType
                    }
                }, mediaResolution && {
                    mediaResolution: {
                        level: mediaResolution
                    }
                });
            }
            function createPartFromCodeExecutionResult(outcome, output) {
                return {
                    codeExecutionResult: {
                        outcome: outcome,
                        output: output
                    }
                };
            }
            function createPartFromExecutableCode(code, language) {
                return {
                    executableCode: {
                        code: code,
                        language: language
                    }
                };
            }
            function _isPart(obj) {
                if (typeof obj === 'object' && obj !== null) return 'fileData' in obj || 'text' in obj || 'functionCall' in obj || 'functionResponse' in obj || 'inlineData' in obj || 'videoMetadata' in obj || 'codeExecutionResult' in obj || 'executableCode' in obj;
                return false;
            }
            function _toParts(partOrString) {
                const parts = [];
                if (typeof partOrString === 'string') parts.push(createPartFromText(partOrString));
                else if (_isPart(partOrString)) parts.push(partOrString);
                else if (Array.isArray(partOrString)) {
                    if (partOrString.length === 0) throw new Error('partOrString cannot be an empty array');
                    for (const part of partOrString){
                        if (typeof part === 'string') parts.push(createPartFromText(part));
                        else if (_isPart(part)) parts.push(part);
                        else throw new Error('element in PartUnion must be a Part object or string');
                    }
                } else throw new Error('partOrString must be a Part object, string, or array');
                return parts;
            }
            function createUserContent(partOrString) {
                return {
                    role: 'user',
                    parts: _toParts(partOrString)
                };
            }
            function createModelContent(partOrString) {
                return {
                    role: 'model',
                    parts: _toParts(partOrString)
                };
            }
            class HttpResponse {
                constructor(response){
                    const headers = {};
                    for (const pair of response.headers.entries())headers[pair[0]] = pair[1];
                    this.headers = headers;
                    this.responseInternal = response;
                }
                json() {
                    return this.responseInternal.json();
                }
            }
            class GenerateContentResponsePromptFeedback {
            }
            class GenerateContentResponseUsageMetadata {
            }
            class GenerateContentResponse {
                get text() {
                    var _a, _b, _c, _d, _e, _f, _g, _h;
                    if (((_d = (_c = (_b = (_a = this.candidates) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.content) === null || _c === void 0 ? void 0 : _c.parts) === null || _d === void 0 ? void 0 : _d.length) === 0) return undefined;
                    if (this.candidates && this.candidates.length > 1) console.warn('there are multiple candidates in the response, returning text from the first one.');
                    let text = '';
                    let anyTextPartText = false;
                    const nonTextParts = [];
                    for (const part of (_h = (_g = (_f = (_e = this.candidates) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.content) === null || _g === void 0 ? void 0 : _g.parts) !== null && _h !== void 0 ? _h : []){
                        for (const [fieldName, fieldValue] of Object.entries(part))if (fieldName !== 'text' && fieldName !== 'thought' && fieldName !== 'thoughtSignature' && (fieldValue !== null || fieldValue !== undefined)) nonTextParts.push(fieldName);
                        if (typeof part.text === 'string') {
                            if (typeof part.thought === 'boolean' && part.thought) continue;
                            anyTextPartText = true;
                            text += part.text;
                        }
                    }
                    if (nonTextParts.length > 0) console.warn(`there are non-text parts ${nonTextParts} in the response, returning concatenation of all text parts. Please refer to the non text parts for a full response from model.`);
                    return anyTextPartText ? text : undefined;
                }
                get data() {
                    var _a, _b, _c, _d, _e, _f, _g, _h;
                    if (((_d = (_c = (_b = (_a = this.candidates) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.content) === null || _c === void 0 ? void 0 : _c.parts) === null || _d === void 0 ? void 0 : _d.length) === 0) return undefined;
                    if (this.candidates && this.candidates.length > 1) console.warn('there are multiple candidates in the response, returning data from the first one.');
                    let data = '';
                    const nonDataParts = [];
                    for (const part of (_h = (_g = (_f = (_e = this.candidates) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.content) === null || _g === void 0 ? void 0 : _g.parts) !== null && _h !== void 0 ? _h : []){
                        for (const [fieldName, fieldValue] of Object.entries(part))if (fieldName !== 'inlineData' && (fieldValue !== null || fieldValue !== undefined)) nonDataParts.push(fieldName);
                        if (part.inlineData && typeof part.inlineData.data === 'string') data += atob(part.inlineData.data);
                    }
                    if (nonDataParts.length > 0) console.warn(`there are non-data parts ${nonDataParts} in the response, returning concatenation of all data parts. Please refer to the non data parts for a full response from model.`);
                    return data.length > 0 ? btoa(data) : undefined;
                }
                get functionCalls() {
                    var _a, _b, _c, _d, _e, _f, _g, _h;
                    if (((_d = (_c = (_b = (_a = this.candidates) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.content) === null || _c === void 0 ? void 0 : _c.parts) === null || _d === void 0 ? void 0 : _d.length) === 0) return undefined;
                    if (this.candidates && this.candidates.length > 1) console.warn('there are multiple candidates in the response, returning function calls from the first one.');
                    const functionCalls = (_h = (_g = (_f = (_e = this.candidates) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.content) === null || _g === void 0 ? void 0 : _g.parts) === null || _h === void 0 ? void 0 : _h.filter((part)=>part.functionCall).map((part)=>part.functionCall).filter((functionCall)=>functionCall !== undefined);
                    if ((functionCalls === null || functionCalls === void 0 ? void 0 : functionCalls.length) === 0) return undefined;
                    return functionCalls;
                }
                get executableCode() {
                    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
                    if (((_d = (_c = (_b = (_a = this.candidates) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.content) === null || _c === void 0 ? void 0 : _c.parts) === null || _d === void 0 ? void 0 : _d.length) === 0) return undefined;
                    if (this.candidates && this.candidates.length > 1) console.warn('there are multiple candidates in the response, returning executable code from the first one.');
                    const executableCode = (_h = (_g = (_f = (_e = this.candidates) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.content) === null || _g === void 0 ? void 0 : _g.parts) === null || _h === void 0 ? void 0 : _h.filter((part)=>part.executableCode).map((part)=>part.executableCode).filter((executableCode)=>executableCode !== undefined);
                    if ((executableCode === null || executableCode === void 0 ? void 0 : executableCode.length) === 0) return undefined;
                    return (_j = executableCode === null || executableCode === void 0 ? void 0 : executableCode[0]) === null || _j === void 0 ? void 0 : _j.code;
                }
                get codeExecutionResult() {
                    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
                    if (((_d = (_c = (_b = (_a = this.candidates) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.content) === null || _c === void 0 ? void 0 : _c.parts) === null || _d === void 0 ? void 0 : _d.length) === 0) return undefined;
                    if (this.candidates && this.candidates.length > 1) console.warn('there are multiple candidates in the response, returning code execution result from the first one.');
                    const codeExecutionResult = (_h = (_g = (_f = (_e = this.candidates) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.content) === null || _g === void 0 ? void 0 : _g.parts) === null || _h === void 0 ? void 0 : _h.filter((part)=>part.codeExecutionResult).map((part)=>part.codeExecutionResult).filter((codeExecutionResult)=>codeExecutionResult !== undefined);
                    if ((codeExecutionResult === null || codeExecutionResult === void 0 ? void 0 : codeExecutionResult.length) === 0) return undefined;
                    return (_j = codeExecutionResult === null || codeExecutionResult === void 0 ? void 0 : codeExecutionResult[0]) === null || _j === void 0 ? void 0 : _j.output;
                }
            }
            class EmbedContentResponse {
            }
            class GenerateImagesResponse {
            }
            class EditImageResponse {
            }
            class UpscaleImageResponse {
            }
            class RecontextImageResponse {
            }
            class SegmentImageResponse {
            }
            class ListModelsResponse {
            }
            class DeleteModelResponse {
            }
            class CountTokensResponse {
            }
            class ComputeTokensResponse {
            }
            class GenerateVideosResponse {
            }
            class GenerateVideosOperation {
                _fromAPIResponse({ apiResponse, _isVertexAI }) {
                    const operation = new GenerateVideosOperation();
                    let response;
                    const op = apiResponse;
                    if (_isVertexAI) response = generateVideosOperationFromVertex$1(op);
                    else response = generateVideosOperationFromMldev$1(op);
                    Object.assign(operation, response);
                    return operation;
                }
            }
            class ListTuningJobsResponse {
            }
            class CancelTuningJobResponse {
            }
            class DeleteCachedContentResponse {
            }
            class ListCachedContentsResponse {
            }
            class ListDocumentsResponse {
            }
            class ListFileSearchStoresResponse {
            }
            class UploadToFileSearchStoreResumableResponse {
            }
            class ImportFileResponse {
            }
            class ImportFileOperation {
                _fromAPIResponse({ apiResponse, _isVertexAI }) {
                    const operation = new ImportFileOperation();
                    const op = apiResponse;
                    const response = importFileOperationFromMldev$1(op);
                    Object.assign(operation, response);
                    return operation;
                }
            }
            class ListFilesResponse {
            }
            class CreateFileResponse {
            }
            class DeleteFileResponse {
            }
            class InlinedResponse {
            }
            class SingleEmbedContentResponse {
            }
            class InlinedEmbedContentResponse {
            }
            class ListBatchJobsResponse {
            }
            class ReplayResponse {
            }
            class RawReferenceImage {
                toReferenceImageAPI() {
                    const referenceImageAPI = {
                        referenceType: 'REFERENCE_TYPE_RAW',
                        referenceImage: this.referenceImage,
                        referenceId: this.referenceId
                    };
                    return referenceImageAPI;
                }
            }
            class MaskReferenceImage {
                toReferenceImageAPI() {
                    const referenceImageAPI = {
                        referenceType: 'REFERENCE_TYPE_MASK',
                        referenceImage: this.referenceImage,
                        referenceId: this.referenceId,
                        maskImageConfig: this.config
                    };
                    return referenceImageAPI;
                }
            }
            class ControlReferenceImage {
                toReferenceImageAPI() {
                    const referenceImageAPI = {
                        referenceType: 'REFERENCE_TYPE_CONTROL',
                        referenceImage: this.referenceImage,
                        referenceId: this.referenceId,
                        controlImageConfig: this.config
                    };
                    return referenceImageAPI;
                }
            }
            class StyleReferenceImage {
                toReferenceImageAPI() {
                    const referenceImageAPI = {
                        referenceType: 'REFERENCE_TYPE_STYLE',
                        referenceImage: this.referenceImage,
                        referenceId: this.referenceId,
                        styleImageConfig: this.config
                    };
                    return referenceImageAPI;
                }
            }
            class SubjectReferenceImage {
                toReferenceImageAPI() {
                    const referenceImageAPI = {
                        referenceType: 'REFERENCE_TYPE_SUBJECT',
                        referenceImage: this.referenceImage,
                        referenceId: this.referenceId,
                        subjectImageConfig: this.config
                    };
                    return referenceImageAPI;
                }
            }
            class ContentReferenceImage {
                toReferenceImageAPI() {
                    const referenceImageAPI = {
                        referenceType: 'REFERENCE_TYPE_CONTENT',
                        referenceImage: this.referenceImage,
                        referenceId: this.referenceId
                    };
                    return referenceImageAPI;
                }
            }
            class LiveServerMessage {
                get text() {
                    var _a, _b, _c;
                    let text = '';
                    let anyTextPartFound = false;
                    const nonTextParts = [];
                    for (const part of (_c = (_b = (_a = this.serverContent) === null || _a === void 0 ? void 0 : _a.modelTurn) === null || _b === void 0 ? void 0 : _b.parts) !== null && _c !== void 0 ? _c : []){
                        for (const [fieldName, fieldValue] of Object.entries(part))if (fieldName !== 'text' && fieldName !== 'thought' && fieldValue !== null) nonTextParts.push(fieldName);
                        if (typeof part.text === 'string') {
                            if (typeof part.thought === 'boolean' && part.thought) continue;
                            anyTextPartFound = true;
                            text += part.text;
                        }
                    }
                    if (nonTextParts.length > 0) console.warn(`there are non-text parts ${nonTextParts} in the response, returning concatenation of all text parts. Please refer to the non text parts for a full response from model.`);
                    return anyTextPartFound ? text : undefined;
                }
                get data() {
                    var _a, _b, _c;
                    let data = '';
                    const nonDataParts = [];
                    for (const part of (_c = (_b = (_a = this.serverContent) === null || _a === void 0 ? void 0 : _a.modelTurn) === null || _b === void 0 ? void 0 : _b.parts) !== null && _c !== void 0 ? _c : []){
                        for (const [fieldName, fieldValue] of Object.entries(part))if (fieldName !== 'inlineData' && fieldValue !== null) nonDataParts.push(fieldName);
                        if (part.inlineData && typeof part.inlineData.data === 'string') data += atob(part.inlineData.data);
                    }
                    if (nonDataParts.length > 0) console.warn(`there are non-data parts ${nonDataParts} in the response, returning concatenation of all data parts. Please refer to the non data parts for a full response from model.`);
                    return data.length > 0 ? btoa(data) : undefined;
                }
            }
            class LiveClientToolResponse {
            }
            class LiveSendToolResponseParameters {
                constructor(){
                    this.functionResponses = [];
                }
            }
            class LiveMusicServerMessage {
                get audioChunk() {
                    if (this.serverContent && this.serverContent.audioChunks && this.serverContent.audioChunks.length > 0) return this.serverContent.audioChunks[0];
                    return undefined;
                }
            }
            class UploadToFileSearchStoreResponse {
            }
            class UploadToFileSearchStoreOperation {
                _fromAPIResponse({ apiResponse, _isVertexAI }) {
                    const operation = new UploadToFileSearchStoreOperation();
                    const op = apiResponse;
                    const response = uploadToFileSearchStoreOperationFromMldev(op);
                    Object.assign(operation, response);
                    return operation;
                }
            }
            function tModel(apiClient, model) {
                if (!model || typeof model !== 'string') throw new Error('model is required and must be a string');
                if (model.includes('..') || model.includes('?') || model.includes('&')) throw new Error('invalid model parameter');
                if (apiClient.isVertexAI()) {
                    if (model.startsWith('publishers/') || model.startsWith('projects/') || model.startsWith('models/')) return model;
                    else if (model.indexOf('/') >= 0) {
                        const parts = model.split('/', 2);
                        return `publishers/${parts[0]}/models/${parts[1]}`;
                    } else return `publishers/google/models/${model}`;
                } else {
                    if (model.startsWith('models/') || model.startsWith('tunedModels/')) return model;
                    else return `models/${model}`;
                }
            }
            function tCachesModel(apiClient, model) {
                const transformedModel = tModel(apiClient, model);
                if (!transformedModel) return '';
                if (transformedModel.startsWith('publishers/') && apiClient.isVertexAI()) return `projects/${apiClient.getProject()}/locations/${apiClient.getLocation()}/${transformedModel}`;
                else if (transformedModel.startsWith('models/') && apiClient.isVertexAI()) return `projects/${apiClient.getProject()}/locations/${apiClient.getLocation()}/publishers/google/${transformedModel}`;
                else return transformedModel;
            }
            function tBlobs(blobs) {
                if (Array.isArray(blobs)) return blobs.map((blob)=>tBlob(blob));
                else return [
                    tBlob(blobs)
                ];
            }
            function tBlob(blob) {
                if (typeof blob === 'object' && blob !== null) return blob;
                throw new Error(`Could not parse input as Blob. Unsupported blob type: ${typeof blob}`);
            }
            function tImageBlob(blob) {
                const transformedBlob = tBlob(blob);
                if (transformedBlob.mimeType && transformedBlob.mimeType.startsWith('image/')) return transformedBlob;
                throw new Error(`Unsupported mime type: ${transformedBlob.mimeType}`);
            }
            function tAudioBlob(blob) {
                const transformedBlob = tBlob(blob);
                if (transformedBlob.mimeType && transformedBlob.mimeType.startsWith('audio/')) return transformedBlob;
                throw new Error(`Unsupported mime type: ${transformedBlob.mimeType}`);
            }
            function tPart(origin) {
                if (origin === null || origin === undefined) throw new Error('PartUnion is required');
                if (typeof origin === 'object') return origin;
                if (typeof origin === 'string') return {
                    text: origin
                };
                throw new Error(`Unsupported part type: ${typeof origin}`);
            }
            function tParts(origin) {
                if (origin === null || origin === undefined || Array.isArray(origin) && origin.length === 0) throw new Error('PartListUnion is required');
                if (Array.isArray(origin)) return origin.map((item)=>tPart(item));
                return [
                    tPart(origin)
                ];
            }
            function _isContent(origin) {
                return origin !== null && origin !== undefined && typeof origin === 'object' && 'parts' in origin && Array.isArray(origin.parts);
            }
            function _isFunctionCallPart(origin) {
                return origin !== null && origin !== undefined && typeof origin === 'object' && 'functionCall' in origin;
            }
            function _isFunctionResponsePart(origin) {
                return origin !== null && origin !== undefined && typeof origin === 'object' && 'functionResponse' in origin;
            }
            function tContent(origin) {
                if (origin === null || origin === undefined) throw new Error('ContentUnion is required');
                if (_isContent(origin)) return origin;
                return {
                    role: 'user',
                    parts: tParts(origin)
                };
            }
            function tContentsForEmbed(apiClient, origin) {
                if (!origin) return [];
                if (apiClient.isVertexAI() && Array.isArray(origin)) return origin.flatMap((item)=>{
                    const content = tContent(item);
                    if (content.parts && content.parts.length > 0 && content.parts[0].text !== undefined) return [
                        content.parts[0].text
                    ];
                    return [];
                });
                else if (apiClient.isVertexAI()) {
                    const content = tContent(origin);
                    if (content.parts && content.parts.length > 0 && content.parts[0].text !== undefined) return [
                        content.parts[0].text
                    ];
                    return [];
                }
                if (Array.isArray(origin)) return origin.map((item)=>tContent(item));
                return [
                    tContent(origin)
                ];
            }
            function tContents(origin) {
                if (origin === null || origin === undefined || Array.isArray(origin) && origin.length === 0) throw new Error('contents are required');
                if (!Array.isArray(origin)) {
                    if (_isFunctionCallPart(origin) || _isFunctionResponsePart(origin)) throw new Error('To specify functionCall or functionResponse parts, please wrap them in a Content object, specifying the role for them');
                    return [
                        tContent(origin)
                    ];
                }
                const result = [];
                const accumulatedParts = [];
                const isContentArray = _isContent(origin[0]);
                for (const item of origin){
                    const isContent = _isContent(item);
                    if (isContent != isContentArray) throw new Error('Mixing Content and Parts is not supported, please group the parts into a the appropriate Content objects and specify the roles for them');
                    if (isContent) result.push(item);
                    else if (_isFunctionCallPart(item) || _isFunctionResponsePart(item)) throw new Error('To specify functionCall or functionResponse parts, please wrap them, and any other parts, in Content objects as appropriate, specifying the role for them');
                    else accumulatedParts.push(item);
                }
                if (!isContentArray) result.push({
                    role: 'user',
                    parts: tParts(accumulatedParts)
                });
                return result;
            }
            function flattenTypeArrayToAnyOf(typeList, resultingSchema) {
                if (typeList.includes('null')) resultingSchema['nullable'] = true;
                const listWithoutNull = typeList.filter((type)=>type !== 'null');
                if (listWithoutNull.length === 1) resultingSchema['type'] = Object.values(Type).includes(listWithoutNull[0].toUpperCase()) ? listWithoutNull[0].toUpperCase() : Type.TYPE_UNSPECIFIED;
                else {
                    resultingSchema['anyOf'] = [];
                    for (const i of listWithoutNull)resultingSchema['anyOf'].push({
                        'type': Object.values(Type).includes(i.toUpperCase()) ? i.toUpperCase() : Type.TYPE_UNSPECIFIED
                    });
                }
            }
            function processJsonSchema(_jsonSchema) {
                const genAISchema = {};
                const schemaFieldNames = [
                    'items'
                ];
                const listSchemaFieldNames = [
                    'anyOf'
                ];
                const dictSchemaFieldNames = [
                    'properties'
                ];
                if (_jsonSchema['type'] && _jsonSchema['anyOf']) throw new Error('type and anyOf cannot be both populated.');
                const incomingAnyOf = _jsonSchema['anyOf'];
                if (incomingAnyOf != null && incomingAnyOf.length == 2) {
                    if (incomingAnyOf[0]['type'] === 'null') {
                        genAISchema['nullable'] = true;
                        _jsonSchema = incomingAnyOf[1];
                    } else if (incomingAnyOf[1]['type'] === 'null') {
                        genAISchema['nullable'] = true;
                        _jsonSchema = incomingAnyOf[0];
                    }
                }
                if (_jsonSchema['type'] instanceof Array) flattenTypeArrayToAnyOf(_jsonSchema['type'], genAISchema);
                for (const [fieldName, fieldValue] of Object.entries(_jsonSchema)){
                    if (fieldValue == null) continue;
                    if (fieldName == 'type') {
                        if (fieldValue === 'null') throw new Error('type: null can not be the only possible type for the field.');
                        if (fieldValue instanceof Array) continue;
                        genAISchema['type'] = Object.values(Type).includes(fieldValue.toUpperCase()) ? fieldValue.toUpperCase() : Type.TYPE_UNSPECIFIED;
                    } else if (schemaFieldNames.includes(fieldName)) genAISchema[fieldName] = processJsonSchema(fieldValue);
                    else if (listSchemaFieldNames.includes(fieldName)) {
                        const listSchemaFieldValue = [];
                        for (const item of fieldValue){
                            if (item['type'] == 'null') {
                                genAISchema['nullable'] = true;
                                continue;
                            }
                            listSchemaFieldValue.push(processJsonSchema(item));
                        }
                        genAISchema[fieldName] = listSchemaFieldValue;
                    } else if (dictSchemaFieldNames.includes(fieldName)) {
                        const dictSchemaFieldValue = {};
                        for (const [key, value] of Object.entries(fieldValue))dictSchemaFieldValue[key] = processJsonSchema(value);
                        genAISchema[fieldName] = dictSchemaFieldValue;
                    } else {
                        if (fieldName === 'additionalProperties') continue;
                        genAISchema[fieldName] = fieldValue;
                    }
                }
                return genAISchema;
            }
            function tSchema(schema) {
                return processJsonSchema(schema);
            }
            function tSpeechConfig(speechConfig) {
                if (typeof speechConfig === 'object') return speechConfig;
                else if (typeof speechConfig === 'string') return {
                    voiceConfig: {
                        prebuiltVoiceConfig: {
                            voiceName: speechConfig
                        }
                    }
                };
                else throw new Error(`Unsupported speechConfig type: ${typeof speechConfig}`);
            }
            function tLiveSpeechConfig(speechConfig) {
                if ('multiSpeakerVoiceConfig' in speechConfig) throw new Error('multiSpeakerVoiceConfig is not supported in the live API.');
                return speechConfig;
            }
            function tTool(tool) {
                if (tool.functionDeclarations) for (const functionDeclaration of tool.functionDeclarations){
                    if (functionDeclaration.parameters) {
                        if (!Object.keys(functionDeclaration.parameters).includes('$schema')) functionDeclaration.parameters = processJsonSchema(functionDeclaration.parameters);
                        else if (!functionDeclaration.parametersJsonSchema) {
                            functionDeclaration.parametersJsonSchema = functionDeclaration.parameters;
                            delete functionDeclaration.parameters;
                        }
                    }
                    if (functionDeclaration.response) {
                        if (!Object.keys(functionDeclaration.response).includes('$schema')) functionDeclaration.response = processJsonSchema(functionDeclaration.response);
                        else if (!functionDeclaration.responseJsonSchema) {
                            functionDeclaration.responseJsonSchema = functionDeclaration.response;
                            delete functionDeclaration.response;
                        }
                    }
                }
                return tool;
            }
            function tTools(tools) {
                if (tools === undefined || tools === null) throw new Error('tools is required');
                if (!Array.isArray(tools)) throw new Error('tools is required and must be an array of Tools');
                const result = [];
                for (const tool of tools)result.push(tool);
                return result;
            }
            function resourceName(client, resourceName1, resourcePrefix, splitsAfterPrefix = 1) {
                const shouldAppendPrefix = !resourceName1.startsWith(`${resourcePrefix}/`) && resourceName1.split('/').length === splitsAfterPrefix;
                if (client.isVertexAI()) {
                    if (resourceName1.startsWith('projects/')) return resourceName1;
                    else if (resourceName1.startsWith('locations/')) return `projects/${client.getProject()}/${resourceName1}`;
                    else if (resourceName1.startsWith(`${resourcePrefix}/`)) return `projects/${client.getProject()}/locations/${client.getLocation()}/${resourceName1}`;
                    else if (shouldAppendPrefix) return `projects/${client.getProject()}/locations/${client.getLocation()}/${resourcePrefix}/${resourceName1}`;
                    else return resourceName1;
                }
                if (shouldAppendPrefix) return `${resourcePrefix}/${resourceName1}`;
                return resourceName1;
            }
            function tCachedContentName(apiClient, name) {
                if (typeof name !== 'string') throw new Error('name must be a string');
                return resourceName(apiClient, name, 'cachedContents');
            }
            function tTuningJobStatus(status) {
                switch(status){
                    case 'STATE_UNSPECIFIED':
                        return 'JOB_STATE_UNSPECIFIED';
                    case 'CREATING':
                        return 'JOB_STATE_RUNNING';
                    case 'ACTIVE':
                        return 'JOB_STATE_SUCCEEDED';
                    case 'FAILED':
                        return 'JOB_STATE_FAILED';
                    default:
                        return status;
                }
            }
            function tBytes(fromImageBytes) {
                return tBytes$1(fromImageBytes);
            }
            function _isFile(origin) {
                return origin !== null && origin !== undefined && typeof origin === 'object' && 'name' in origin;
            }
            function isGeneratedVideo(origin) {
                return origin !== null && origin !== undefined && typeof origin === 'object' && 'video' in origin;
            }
            function isVideo(origin) {
                return origin !== null && origin !== undefined && typeof origin === 'object' && 'uri' in origin;
            }
            function tFileName(fromName) {
                var _a;
                let name;
                if (_isFile(fromName)) name = fromName.name;
                if (isVideo(fromName)) {
                    name = fromName.uri;
                    if (name === undefined) return undefined;
                }
                if (isGeneratedVideo(fromName)) {
                    name = (_a = fromName.video) === null || _a === void 0 ? void 0 : _a.uri;
                    if (name === undefined) return undefined;
                }
                if (typeof fromName === 'string') name = fromName;
                if (name === undefined) throw new Error('Could not extract file name from the provided input.');
                if (name.startsWith('https://')) {
                    const suffix = name.split('files/')[1];
                    const match = suffix.match(/[a-z0-9]+/);
                    if (match === null) throw new Error(`Could not extract file name from URI ${name}`);
                    name = match[0];
                } else if (name.startsWith('files/')) name = name.split('files/')[1];
                return name;
            }
            function tModelsUrl(apiClient, baseModels) {
                let res;
                if (apiClient.isVertexAI()) res = baseModels ? 'publishers/google/models' : 'models';
                else res = baseModels ? 'models' : 'tunedModels';
                return res;
            }
            function tExtractModels(response) {
                for (const key of [
                    'models',
                    'tunedModels',
                    'publisherModels'
                ]){
                    if (hasField(response, key)) return response[key];
                }
                return [];
            }
            function hasField(data, fieldName) {
                return data !== null && typeof data === 'object' && fieldName in data;
            }
            function mcpToGeminiTool(mcpTool, config = {}) {
                const mcpToolSchema = mcpTool;
                const functionDeclaration = {
                    name: mcpToolSchema['name'],
                    description: mcpToolSchema['description'],
                    parametersJsonSchema: mcpToolSchema['inputSchema']
                };
                if (mcpToolSchema['outputSchema']) functionDeclaration['responseJsonSchema'] = mcpToolSchema['outputSchema'];
                if (config.behavior) functionDeclaration['behavior'] = config.behavior;
                const geminiTool = {
                    functionDeclarations: [
                        functionDeclaration
                    ]
                };
                return geminiTool;
            }
            function mcpToolsToGeminiTool(mcpTools, config = {}) {
                const functionDeclarations = [];
                const toolNames = new Set();
                for (const mcpTool of mcpTools){
                    const mcpToolName = mcpTool.name;
                    if (toolNames.has(mcpToolName)) throw new Error(`Duplicate function name ${mcpToolName} found in MCP tools. Please ensure function names are unique.`);
                    toolNames.add(mcpToolName);
                    const geminiTool = mcpToGeminiTool(mcpTool, config);
                    if (geminiTool.functionDeclarations) functionDeclarations.push(...geminiTool.functionDeclarations);
                }
                return {
                    functionDeclarations: functionDeclarations
                };
            }
            function tBatchJobSource(client, src) {
                let sourceObj;
                if (typeof src === 'string') {
                    if (client.isVertexAI()) {
                        if (src.startsWith('gs://')) sourceObj = {
                            format: 'jsonl',
                            gcsUri: [
                                src
                            ]
                        };
                        else if (src.startsWith('bq://')) sourceObj = {
                            format: 'bigquery',
                            bigqueryUri: src
                        };
                        else throw new Error(`Unsupported string source for Vertex AI: ${src}`);
                    } else {
                        if (src.startsWith('files/')) sourceObj = {
                            fileName: src
                        };
                        else throw new Error(`Unsupported string source for Gemini API: ${src}`);
                    }
                } else if (Array.isArray(src)) {
                    if (client.isVertexAI()) throw new Error('InlinedRequest[] is not supported in Vertex AI.');
                    sourceObj = {
                        inlinedRequests: src
                    };
                } else sourceObj = src;
                const vertexSourcesCount = [
                    sourceObj.gcsUri,
                    sourceObj.bigqueryUri
                ].filter(Boolean).length;
                const mldevSourcesCount = [
                    sourceObj.inlinedRequests,
                    sourceObj.fileName
                ].filter(Boolean).length;
                if (client.isVertexAI()) {
                    if (mldevSourcesCount > 0 || vertexSourcesCount !== 1) throw new Error('Exactly one of `gcsUri` or `bigqueryUri` must be set for Vertex AI.');
                } else {
                    if (vertexSourcesCount > 0 || mldevSourcesCount !== 1) throw new Error("Exactly one of `inlinedRequests`, `fileName`, must be set for Gemini API.");
                }
                return sourceObj;
            }
            function tBatchJobDestination(dest) {
                if (typeof dest !== 'string') return dest;
                const destString = dest;
                if (destString.startsWith('gs://')) return {
                    format: 'jsonl',
                    gcsUri: destString
                };
                else if (destString.startsWith('bq://')) return {
                    format: 'bigquery',
                    bigqueryUri: destString
                };
                else throw new Error(`Unsupported destination: ${destString}`);
            }
            function tRecvBatchJobDestination(dest) {
                if (typeof dest !== 'object' || dest === null) return {};
                const obj = dest;
                const inlineResponsesVal = obj['inlinedResponses'];
                if (typeof inlineResponsesVal !== 'object' || inlineResponsesVal === null) return dest;
                const inlineResponsesObj = inlineResponsesVal;
                const responsesArray = inlineResponsesObj['inlinedResponses'];
                if (!Array.isArray(responsesArray) || responsesArray.length === 0) return dest;
                let hasEmbedding = false;
                for (const responseItem of responsesArray){
                    if (typeof responseItem !== 'object' || responseItem === null) continue;
                    const responseItemObj = responseItem;
                    const responseVal = responseItemObj['response'];
                    if (typeof responseVal !== 'object' || responseVal === null) continue;
                    const responseObj = responseVal;
                    if (responseObj['embedding'] !== undefined) {
                        hasEmbedding = true;
                        break;
                    }
                }
                if (hasEmbedding) {
                    obj['inlinedEmbedContentResponses'] = obj['inlinedResponses'];
                    delete obj['inlinedResponses'];
                }
                return dest;
            }
            function tBatchJobName(apiClient, name) {
                const nameString = name;
                if (!apiClient.isVertexAI()) {
                    const mldevPattern = /batches\/[^/]+$/;
                    if (mldevPattern.test(nameString)) return nameString.split('/').pop();
                    else throw new Error(`Invalid batch job name: ${nameString}.`);
                }
                const vertexPattern = /^projects\/[^/]+\/locations\/[^/]+\/batchPredictionJobs\/[^/]+$/;
                if (vertexPattern.test(nameString)) return nameString.split('/').pop();
                else if (/^\d+$/.test(nameString)) return nameString;
                else throw new Error(`Invalid batch job name: ${nameString}.`);
            }
            function tJobState(state) {
                const stateString = state;
                if (stateString === 'BATCH_STATE_UNSPECIFIED') return 'JOB_STATE_UNSPECIFIED';
                else if (stateString === 'BATCH_STATE_PENDING') return 'JOB_STATE_PENDING';
                else if (stateString === 'BATCH_STATE_RUNNING') return 'JOB_STATE_RUNNING';
                else if (stateString === 'BATCH_STATE_SUCCEEDED') return 'JOB_STATE_SUCCEEDED';
                else if (stateString === 'BATCH_STATE_FAILED') return 'JOB_STATE_FAILED';
                else if (stateString === 'BATCH_STATE_CANCELLED') return 'JOB_STATE_CANCELLED';
                else if (stateString === 'BATCH_STATE_EXPIRED') return 'JOB_STATE_EXPIRED';
                else return stateString;
            }
            function batchJobDestinationFromMldev(fromObject) {
                const toObject = {};
                const fromFileName = getValueByPath(fromObject, [
                    'responsesFile'
                ]);
                if (fromFileName != null) setValueByPath(toObject, [
                    'fileName'
                ], fromFileName);
                const fromInlinedResponses = getValueByPath(fromObject, [
                    'inlinedResponses',
                    'inlinedResponses'
                ]);
                if (fromInlinedResponses != null) {
                    let transformedList = fromInlinedResponses;
                    if (Array.isArray(transformedList)) transformedList = transformedList.map((item)=>{
                        return inlinedResponseFromMldev(item);
                    });
                    setValueByPath(toObject, [
                        'inlinedResponses'
                    ], transformedList);
                }
                const fromInlinedEmbedContentResponses = getValueByPath(fromObject, [
                    'inlinedEmbedContentResponses',
                    'inlinedResponses'
                ]);
                if (fromInlinedEmbedContentResponses != null) {
                    let transformedList = fromInlinedEmbedContentResponses;
                    if (Array.isArray(transformedList)) transformedList = transformedList.map((item)=>{
                        return item;
                    });
                    setValueByPath(toObject, [
                        'inlinedEmbedContentResponses'
                    ], transformedList);
                }
                return toObject;
            }
            function batchJobDestinationFromVertex(fromObject) {
                const toObject = {};
                const fromFormat = getValueByPath(fromObject, [
                    'predictionsFormat'
                ]);
                if (fromFormat != null) setValueByPath(toObject, [
                    'format'
                ], fromFormat);
                const fromGcsUri = getValueByPath(fromObject, [
                    'gcsDestination',
                    'outputUriPrefix'
                ]);
                if (fromGcsUri != null) setValueByPath(toObject, [
                    'gcsUri'
                ], fromGcsUri);
                const fromBigqueryUri = getValueByPath(fromObject, [
                    'bigqueryDestination',
                    'outputUri'
                ]);
                if (fromBigqueryUri != null) setValueByPath(toObject, [
                    'bigqueryUri'
                ], fromBigqueryUri);
                return toObject;
            }
            function batchJobDestinationToVertex(fromObject) {
                const toObject = {};
                const fromFormat = getValueByPath(fromObject, [
                    'format'
                ]);
                if (fromFormat != null) setValueByPath(toObject, [
                    'predictionsFormat'
                ], fromFormat);
                const fromGcsUri = getValueByPath(fromObject, [
                    'gcsUri'
                ]);
                if (fromGcsUri != null) setValueByPath(toObject, [
                    'gcsDestination',
                    'outputUriPrefix'
                ], fromGcsUri);
                const fromBigqueryUri = getValueByPath(fromObject, [
                    'bigqueryUri'
                ]);
                if (fromBigqueryUri != null) setValueByPath(toObject, [
                    'bigqueryDestination',
                    'outputUri'
                ], fromBigqueryUri);
                if (getValueByPath(fromObject, [
                    'fileName'
                ]) !== undefined) throw new Error('fileName parameter is not supported in Vertex AI.');
                if (getValueByPath(fromObject, [
                    'inlinedResponses'
                ]) !== undefined) throw new Error('inlinedResponses parameter is not supported in Vertex AI.');
                if (getValueByPath(fromObject, [
                    'inlinedEmbedContentResponses'
                ]) !== undefined) throw new Error('inlinedEmbedContentResponses parameter is not supported in Vertex AI.');
                return toObject;
            }
            function batchJobFromMldev(fromObject) {
                const toObject = {};
                const fromName = getValueByPath(fromObject, [
                    'name'
                ]);
                if (fromName != null) setValueByPath(toObject, [
                    'name'
                ], fromName);
                const fromDisplayName = getValueByPath(fromObject, [
                    'metadata',
                    'displayName'
                ]);
                if (fromDisplayName != null) setValueByPath(toObject, [
                    'displayName'
                ], fromDisplayName);
                const fromState = getValueByPath(fromObject, [
                    'metadata',
                    'state'
                ]);
                if (fromState != null) setValueByPath(toObject, [
                    'state'
                ], tJobState(fromState));
                const fromCreateTime = getValueByPath(fromObject, [
                    'metadata',
                    'createTime'
                ]);
                if (fromCreateTime != null) setValueByPath(toObject, [
                    'createTime'
                ], fromCreateTime);
                const fromEndTime = getValueByPath(fromObject, [
                    'metadata',
                    'endTime'
                ]);
                if (fromEndTime != null) setValueByPath(toObject, [
                    'endTime'
                ], fromEndTime);
                const fromUpdateTime = getValueByPath(fromObject, [
                    'metadata',
                    'updateTime'
                ]);
                if (fromUpdateTime != null) setValueByPath(toObject, [
                    'updateTime'
                ], fromUpdateTime);
                const fromModel = getValueByPath(fromObject, [
                    'metadata',
                    'model'
                ]);
                if (fromModel != null) setValueByPath(toObject, [
                    'model'
                ], fromModel);
                const fromDest = getValueByPath(fromObject, [
                    'metadata',
                    'output'
                ]);
                if (fromDest != null) setValueByPath(toObject, [
                    'dest'
                ], batchJobDestinationFromMldev(tRecvBatchJobDestination(fromDest)));
                return toObject;
            }
            function batchJobFromVertex(fromObject) {
                const toObject = {};
                const fromName = getValueByPath(fromObject, [
                    'name'
                ]);
                if (fromName != null) setValueByPath(toObject, [
                    'name'
                ], fromName);
                const fromDisplayName = getValueByPath(fromObject, [
                    'displayName'
                ]);
                if (fromDisplayName != null) setValueByPath(toObject, [
                    'displayName'
                ], fromDisplayName);
                const fromState = getValueByPath(fromObject, [
                    'state'
                ]);
                if (fromState != null) setValueByPath(toObject, [
                    'state'
                ], tJobState(fromState));
                const fromError = getValueByPath(fromObject, [
                    'error'
                ]);
                if (fromError != null) setValueByPath(toObject, [
                    'error'
                ], fromError);
                const fromCreateTime = getValueByPath(fromObject, [
                    'createTime'
                ]);
                if (fromCreateTime != null) setValueByPath(toObject, [
                    'createTime'
                ], fromCreateTime);
                const fromStartTime = getValueByPath(fromObject, [
                    'startTime'
                ]);
                if (fromStartTime != null) setValueByPath(toObject, [
                    'startTime'
                ], fromStartTime);
                const fromEndTime = getValueByPath(fromObject, [
                    'endTime'
                ]);
                if (fromEndTime != null) setValueByPath(toObject, [
                    'endTime'
                ], fromEndTime);
                const fromUpdateTime = getValueByPath(fromObject, [
                    'updateTime'
                ]);
                if (fromUpdateTime != null) setValueByPath(toObject, [
                    'updateTime'
                ], fromUpdateTime);
                const fromModel = getValueByPath(fromObject, [
                    'model'
                ]);
                if (fromModel != null) setValueByPath(toObject, [
                    'model'
                ], fromModel);
                const fromSrc = getValueByPath(fromObject, [
                    'inputConfig'
                ]);
                if (fromSrc != null) setValueByPath(toObject, [
                    'src'
                ], batchJobSourceFromVertex(fromSrc));
                const fromDest = getValueByPath(fromObject, [
                    'outputConfig'
                ]);
                if (fromDest != null) setValueByPath(toObject, [
                    'dest'
                ], batchJobDestinationFromVertex(tRecvBatchJobDestination(fromDest)));
                const fromCompletionStats = getValueByPath(fromObject, [
                    'completionStats'
                ]);
                if (fromCompletionStats != null) setValueByPath(toObject, [
                    'completionStats'
                ], fromCompletionStats);
                return toObject;
            }
            function batchJobSourceFromVertex(fromObject) {
                const toObject = {};
                const fromFormat = getValueByPath(fromObject, [
                    'instancesFormat'
                ]);
                if (fromFormat != null) setValueByPath(toObject, [
                    'format'
                ], fromFormat);
                const fromGcsUri = getValueByPath(fromObject, [
                    'gcsSource',
                    'uris'
                ]);
                if (fromGcsUri != null) setValueByPath(toObject, [
                    'gcsUri'
                ], fromGcsUri);
                const fromBigqueryUri = getValueByPath(fromObject, [
                    'bigquerySource',
                    'inputUri'
                ]);
                if (fromBigqueryUri != null) setValueByPath(toObject, [
                    'bigqueryUri'
                ], fromBigqueryUri);
                return toObject;
            }
            function batchJobSourceToMldev(apiClient, fromObject) {
                const toObject = {};
                if (getValueByPath(fromObject, [
                    'format'
                ]) !== undefined) throw new Error('format parameter is not supported in Gemini API.');
                if (getValueByPath(fromObject, [
                    'gcsUri'
                ]) !== undefined) throw new Error('gcsUri parameter is not supported in Gemini API.');
                if (getValueByPath(fromObject, [
                    'bigqueryUri'
                ]) !== undefined) throw new Error('bigqueryUri parameter is not supported in Gemini API.');
                const fromFileName = getValueByPath(fromObject, [
                    'fileName'
                ]);
                if (fromFileName != null) setValueByPath(toObject, [
                    'fileName'
                ], fromFileName);
                const fromInlinedRequests = getValueByPath(fromObject, [
                    'inlinedRequests'
                ]);
                if (fromInlinedRequests != null) {
                    let transformedList = fromInlinedRequests;
                    if (Array.isArray(transformedList)) transformedList = transformedList.map((item)=>{
                        return inlinedRequestToMldev(apiClient, item);
                    });
                    setValueByPath(toObject, [
                        'requests',
                        'requests'
                    ], transformedList);
                }
                return toObject;
            }
            function batchJobSourceToVertex(fromObject) {
                const toObject = {};
                const fromFormat = getValueByPath(fromObject, [
                    'format'
                ]);
                if (fromFormat != null) setValueByPath(toObject, [
                    'instancesFormat'
                ], fromFormat);
                const fromGcsUri = getValueByPath(fromObject, [
                    'gcsUri'
                ]);
                if (fromGcsUri != null) setValueByPath(toObject, [
                    'gcsSource',
                    'uris'
                ], fromGcsUri);
                const fromBigqueryUri = getValueByPath(fromObject, [
                    'bigqueryUri'
                ]);
                if (fromBigqueryUri != null) setValueByPath(toObject, [
                    'bigquerySource',
                    'inputUri'
                ], fromBigqueryUri);
                if (getValueByPath(fromObject, [
                    'fileName'
                ]) !== undefined) throw new Error('fileName parameter is not supported in Vertex AI.');
                if (getValueByPath(fromObject, [
                    'inlinedRequests'
                ]) !== undefined) throw new Error('inlinedRequests parameter is not supported in Vertex AI.');
                return toObject;
            }
            function blobToMldev$4(fromObject) {
                const toObject = {};
                const fromData = getValueByPath(fromObject, [
                    'data'
                ]);
                if (fromData != null) setValueByPath(toObject, [
                    'data'
                ], fromData);
                if (getValueByPath(fromObject, [
                    'displayName'
                ]) !== undefined) throw new Error('displayName parameter is not supported in Gemini API.');
                const fromMimeType = getValueByPath(fromObject, [
                    'mimeType'
                ]);
                if (fromMimeType != null) setValueByPath(toObject, [
                    'mimeType'
                ], fromMimeType);
                return toObject;
            }
            function cancelBatchJobParametersToMldev(apiClient, fromObject) {
                const toObject = {};
                const fromName = getValueByPath(fromObject, [
                    'name'
                ]);
                if (fromName != null) setValueByPath(toObject, [
                    '_url',
                    'name'
                ], tBatchJobName(apiClient, fromName));
                return toObject;
            }
            function cancelBatchJobParametersToVertex(apiClient, fromObject) {
                const toObject = {};
                const fromName = getValueByPath(fromObject, [
                    'name'
                ]);
                if (fromName != null) setValueByPath(toObject, [
                    '_url',
                    'name'
                ], tBatchJobName(apiClient, fromName));
                return toObject;
            }
            function candidateFromMldev$1(fromObject) {
                const toObject = {};
                const fromContent = getValueByPath(fromObject, [
                    'content'
                ]);
                if (fromContent != null) setValueByPath(toObject, [
                    'content'
                ], fromContent);
                const fromCitationMetadata = getValueByPath(fromObject, [
                    'citationMetadata'
                ]);
                if (fromCitationMetadata != null) setValueByPath(toObject, [
                    'citationMetadata'
                ], citationMetadataFromMldev$1(fromCitationMetadata));
                const fromTokenCount = getValueByPath(fromObject, [
                    'tokenCount'
                ]);
                if (fromTokenCount != null) setValueByPath(toObject, [
                    'tokenCount'
                ], fromTokenCount);
                const fromFinishReason = getValueByPath(fromObject, [
                    'finishReason'
                ]);
                if (fromFinishReason != null) setValueByPath(toObject, [
                    'finishReason'
                ], fromFinishReason);
                const fromAvgLogprobs = getValueByPath(fromObject, [
                    'avgLogprobs'
                ]);
                if (fromAvgLogprobs != null) setValueByPath(toObject, [
                    'avgLogprobs'
                ], fromAvgLogprobs);
                const fromGroundingMetadata = getValueByPath(fromObject, [
                    'groundingMetadata'
                ]);
                if (fromGroundingMetadata != null) setValueByPath(toObject, [
                    'groundingMetadata'
                ], fromGroundingMetadata);
                const fromIndex = getValueByPath(fromObject, [
                    'index'
                ]);
                if (fromIndex != null) setValueByPath(toObject, [
                    'index'
                ], fromIndex);
                const fromLogprobsResult = getValueByPath(fromObject, [
                    'logprobsResult'
                ]);
                if (fromLogprobsResult != null) setValueByPath(toObject, [
                    'logprobsResult'
                ], fromLogprobsResult);
                const fromSafetyRatings = getValueByPath(fromObject, [
                    'safetyRatings'
                ]);
                if (fromSafetyRatings != null) {
                    let transformedList = fromSafetyRatings;
                    if (Array.isArray(transformedList)) transformedList = transformedList.map((item)=>{
                        return item;
                    });
                    setValueByPath(toObject, [
                        'safetyRatings'
                    ], transformedList);
                }
                const fromUrlContextMetadata = getValueByPath(fromObject, [
                    'urlContextMetadata'
                ]);
                if (fromUrlContextMetadata != null) setValueByPath(toObject, [
                    'urlContextMetadata'
                ], fromUrlContextMetadata);
                return toObject;
            }
            function citationMetadataFromMldev$1(fromObject) {
                const toObject = {};
                const fromCitations = getValueByPath(fromObject, [
                    'citationSources'
                ]);
                if (fromCitations != null) {
                    let transformedList = fromCitations;
                    if (Array.isArray(transformedList)) transformedList = transformedList.map((item)=>{
                        return item;
                    });
                    setValueByPath(toObject, [
                        'citations'
                    ], transformedList);
                }
                return toObject;
            }
            function contentToMldev$4(fromObject) {
                const toObject = {};
                const fromParts = getValueByPath(fromObject, [
                    'parts'
                ]);
                if (fromParts != null) {
                    let transformedList = fromParts;
                    if (Array.isArray(transformedList)) transformedList = transformedList.map((item)=>{
                        return partToMldev$4(item);
                    });
                    setValueByPath(toObject, [
                        'parts'
                    ], transformedList);
                }
                const fromRole = getValueByPath(fromObject, [
                    'role'
                ]);
                if (fromRole != null) setValueByPath(toObject, [
                    'role'
                ], fromRole);
                return toObject;
            }
            function createBatchJobConfigToMldev(fromObject, parentObject) {
                const toObject = {};
                const fromDisplayName = getValueByPath(fromObject, [
                    'displayName'
                ]);
                if (parentObject !== undefined && fromDisplayName != null) setValueByPath(parentObject, [
                    'batch',
                    'displayName'
                ], fromDisplayName);
                if (getValueByPath(fromObject, [
                    'dest'
                ]) !== undefined) throw new Error('dest parameter is not supported in Gemini API.');
                return toObject;
            }
            function createBatchJobConfigToVertex(fromObject, parentObject) {
                const toObject = {};
                const fromDisplayName = getValueByPath(fromObject, [
                    'displayName'
                ]);
                if (parentObject !== undefined && fromDisplayName != null) setValueByPath(parentObject, [
                    'displayName'
                ], fromDisplayName);
                const fromDest = getValueByPath(fromObject, [
                    'dest'
                ]);
                if (parentObject !== undefined && fromDest != null) setValueByPath(parentObject, [
                    'outputConfig'
                ], batchJobDestinationToVertex(tBatchJobDestination(fromDest)));
                return toObject;
            }
            function createBatchJobParametersToMldev(apiClient, fromObject) {
                const toObject = {};
                const fromModel = getValueByPath(fromObject, [
                    'model'
                ]);
                if (fromModel != null) setValueByPath(toObject, [
                    '_url',
                    'model'
                ], tModel(apiClient, fromModel));
                const fromSrc = getValueByPath(fromObject, [
                    'src'
                ]);
                if (fromSrc != null) setValueByPath(toObject, [
                    'batch',
                    'inputConfig'
                ], batchJobSourceToMldev(apiClient, tBatchJobSource(apiClient, fromSrc)));
                const fromConfig = getValueByPath(fromObject, [
                    'config'
                ]);
                if (fromConfig != null) createBatchJobConfigToMldev(fromConfig, toObject);
                return toObject;
            }
            function createBatchJobParametersToVertex(apiClient, fromObject) {
                const toObject = {};
                const fromModel = getValueByPath(fromObject, [
                    'model'
                ]);
                if (fromModel != null) setValueByPath(toObject, [
                    'model'
                ], tModel(apiClient, fromModel));
                const fromSrc = getValueByPath(fromObject, [
                    'src'
                ]);
                if (fromSrc != null) setValueByPath(toObject, [
                    'inputConfig'
                ], batchJobSourceToVertex(tBatchJobSource(apiClient, fromSrc)));
                const fromConfig = getValueByPath(fromObject, [
                    'config'
                ]);
                if (fromConfig != null) createBatchJobConfigToVertex(fromConfig, toObject);
                return toObject;
            }
            function createEmbeddingsBatchJobConfigToMldev(fromObject, parentObject) {
                const toObject = {};
                const fromDisplayName = getValueByPath(fromObject, [
                    'displayName'
                ]);
                if (parentObject !== undefined && fromDisplayName != null) setValueByPath(parentObject, [
                    'batch',
                    'displayName'
                ], fromDisplayName);
                return toObject;
            }
            function createEmbeddingsBatchJobParametersToMldev(apiClient, fromObject) {
                const toObject = {};
                const fromModel = getValueByPath(fromObject, [
                    'model'
                ]);
                if (fromModel != null) setValueByPath(toObject, [
                    '_url',
                    'model'
                ], tModel(apiClient, fromModel));
                const fromSrc = getValueByPath(fromObject, [
                    'src'
                ]);
                if (fromSrc != null) setValueByPath(toObject, [
                    'batch',
                    'inputConfig'
                ], embeddingsBatchJobSourceToMldev(apiClient, fromSrc));
                const fromConfig = getValueByPath(fromObject, [
                    'config'
                ]);
                if (fromConfig != null) createEmbeddingsBatchJobConfigToMldev(fromConfig, toObject);
                return toObject;
            }
            function deleteBatchJobParametersToMldev(apiClient, fromObject) {
                const toObject = {};
                const fromName = getValueByPath(fromObject, [
                    'name'
                ]);
                if (fromName != null) setValueByPath(toObject, [
                    '_url',
                    'name'
                ], tBatchJobName(apiClient, fromName));
                return toObject;
            }
            function deleteBatchJobParametersToVertex(apiClient, fromObject) {
                const toObject = {};
                const fromName = getValueByPath(fromObject, [
                    'name'
                ]);
                if (fromName != null) setValueByPath(toObject, [
                    '_url',
                    'name'
                ], tBatchJobName(apiClient, fromName));
                return toObject;
            }
            function deleteResourceJobFromMldev(fromObject) {
                const toObject = {};
                const fromSdkHttpResponse = getValueByPath(fromObject, [
                    'sdkHttpResponse'
                ]);
                if (fromSdkHttpResponse != null) setValueByPath(toObject, [
                    'sdkHttpResponse'
                ], fromSdkHttpResponse);
                const fromName = getValueByPath(fromObject, [
                    'name'
                ]);
                if (fromName != null) setValueByPath(toObject, [
                    'name'
                ], fromName);
                const fromDone = getValueByPath(fromObject, [
                    'done'
                ]);
                if (fromDone != null) setValueByPath(toObject, [
                    'done'
                ], fromDone);
                const fromError = getValueByPath(fromObject, [
                    'error'
                ]);
                if (fromError != null) setValueByPath(toObject, [
                    'error'
                ], fromError);
                return toObject;
            }
            function deleteResourceJobFromVertex(fromObject) {
                const toObject = {};
                const fromSdkHttpResponse = getValueByPath(fromObject, [
                    'sdkHttpResponse'
                ]);
                if (fromSdkHttpResponse != null) setValueByPath(toObject, [
                    'sdkHttpResponse'
                ], fromSdkHttpResponse);
                const fromName = getValueByPath(fromObject, [
                    'name'
                ]);
                if (fromName != null) setValueByPath(toObject, [
                    'name'
                ], fromName);
                const fromDone = getValueByPath(fromObject, [
                    'done'
                ]);
                if (fromDone != null) setValueByPath(toObject, [
                    'done'
                ], fromDone);
                const fromError = getValueByPath(fromObject, [
                    'error'
                ]);
                if (fromError != null) setValueByPath(toObject, [
                    'error'
                ], fromError);
                return toObject;
            }
            function embedContentBatchToMldev(apiClient, fromObject) {
                const toObject = {};
                const fromContents = getValueByPath(fromObject, [
                    'contents'
                ]);
                if (fromContents != null) {
                    let transformedList = tContentsForEmbed(apiClient, fromContents);
                    if (Array.isArray(transformedList)) transformedList = transformedList.map((item)=>{
                        return item;
                    });
                    setValueByPath(toObject, [
                        'requests[]',
                        'request',
                        'content'
                    ], transformedList);
                }
                const fromConfig = getValueByPath(fromObject, [
                    'config'
                ]);
                if (fromConfig != null) {
                    setValueByPath(toObject, [
                        '_self'
                    ], embedContentConfigToMldev$1(fromConfig, toObject));
                    moveValueByPath(toObject, {
                        'requests[].*': 'requests[].request.*'
                    });
                }
                return toObject;
            }
            function embedContentConfigToMldev$1(fromObject, parentObject) {
                const toObject = {};
                const fromTaskType = getValueByPath(fromObject, [
                    'taskType'
                ]);
                if (parentObject !== undefined && fromTaskType != null) setValueByPath(parentObject, [
                    'requests[]',
                    'taskType'
                ], fromTaskType);
                const fromTitle = getValueByPath(fromObject, [
                    'title'
                ]);
                if (parentObject !== undefined && fromTitle != null) setValueByPath(parentObject, [
                    'requests[]',
                    'title'
                ], fromTitle);
                const fromOutputDimensionality = getValueByPath(fromObject, [
                    'outputDimensionality'
                ]);
                if (parentObject !== undefined && fromOutputDimensionality != null) setValueByPath(parentObject, [
                    'requests[]',
                    'outputDimensionality'
                ], fromOutputDimensionality);
                if (getValueByPath(fromObject, [
                    'mimeType'
                ]) !== undefined) throw new Error('mimeType parameter is not supported in Gemini API.');
                if (getValueByPath(fromObject, [
                    'autoTruncate'
                ]) !== undefined) throw new Error('autoTruncate parameter is not supported in Gemini API.');
                return toObject;
            }
            function embeddingsBatchJobSourceToMldev(apiClient, fromObject) {
                const toObject = {};
                const fromFileName = getValueByPath(fromObject, [
                    'fileName'
                ]);
                if (fromFileName != null) setValueByPath(toObject, [
                    'file_name'
                ], fromFileName);
                const fromInlinedRequests = getValueByPath(fromObject, [
                    'inlinedRequests'
                ]);
                if (fromInlinedRequests != null) setValueByPath(toObject, [
                    'requests'
                ], embedContentBatchToMldev(apiClient, fromInlinedRequests));
                return toObject;
            }
            function fileDataToMldev$4(fromObject) {
                const toObject = {};
                if (getValueByPath(fromObject, [
                    'displayName'
                ]) !== undefined) throw new Error('displayName parameter is not supported in Gemini API.');
                const fromFileUri = getValueByPath(fromObject, [
                    'fileUri'
                ]);
                if (fromFileUri != null) setValueByPath(toObject, [
                    'fileUri'
                ], fromFileUri);
                const fromMimeType = getValueByPath(fromObject, [
                    'mimeType'
                ]);
                if (fromMimeType != null) setValueByPath(toObject, [
                    'mimeType'
                ], fromMimeType);
                return toObject;
            }
            function functionCallToMldev$4(fromObject) {
                const toObject = {};
                const fromId = getValueByPath(fromObject, [
                    'id'
                ]);
                if (fromId != null) setValueByPath(toObject, [
                    'id'
                ], fromId);
                const fromArgs = getValueByPath(fromObject, [
                    'args'
                ]);
                if (fromArgs != null) setValueByPath(toObject, [
                    'args'
                ], fromArgs);
                const fromName = getValueByPath(fromObject, [
                    'name'
                ]);
                if (fromName != null) setValueByPath(toObject, [
                    'name'
                ], fromName);
                if (getValueByPath(fromObject, [
                    'partialArgs'
                ]) !== undefined) throw new Error('partialArgs parameter is not supported in Gemini API.');
                if (getValueByPath(fromObject, [
                    'willContinue'
                ]) !== undefined) throw new Error('willContinue parameter is not supported in Gemini API.');
                return toObject;
            }
            function functionCallingConfigToMldev$2(fromObject) {
                const toObject = {};
                const fromMode = getValueByPath(fromObject, [
                    'mode'
                ]);
                if (fromMode != null) setValueByPath(toObject, [
                    'mode'
                ], fromMode);
                const fromAllowedFunctionNames = getValueByPath(fromObject, [
                    'allowedFunctionNames'
                ]);
                if (fromAllowedFunctionNames != null) setValueByPath(toObject, [
                    'allowedFunctionNames'
                ], fromAllowedFunctionNames);
                if (getValueByPath(fromObject, [
                    'streamFunctionCallArguments'
                ]) !== undefined) throw new Error('streamFunctionCallArguments parameter is not supported in Gemini API.');
                return toObject;
            }
            function generateContentConfigToMldev$1(apiClient, fromObject, parentObject) {
                const toObject = {};
                const fromSystemInstruction = getValueByPath(fromObject, [
                    'systemInstruction'
                ]);
                if (parentObject !== undefined && fromSystemInstruction != null) setValueByPath(parentObject, [
                    'systemInstruction'
                ], contentToMldev$4(tContent(fromSystemInstruction)));
                const fromTemperature = getValueByPath(fromObject, [
                    'temperature'
                ]);
                if (fromTemperature != null) setValueByPath(toObject, [
                    'temperature'
                ], fromTemperature);
                const fromTopP = getValueByPath(fromObject, [
                    'topP'
                ]);
                if (fromTopP != null) setValueByPath(toObject, [
                    'topP'
                ], fromTopP);
                const fromTopK = getValueByPath(fromObject, [
                    'topK'
                ]);
                if (fromTopK != null) setValueByPath(toObject, [
                    'topK'
                ], fromTopK);
                const fromCandidateCount = getValueByPath(fromObject, [
                    'candidateCount'
                ]);
                if (fromCandidateCount != null) setValueByPath(toObject, [
                    'candidateCount'
                ], fromCandidateCount);
                const fromMaxOutputTokens = getValueByPath(fromObject, [
                    'maxOutputTokens'
                ]);
                if (fromMaxOutputTokens != null) setValueByPath(toObject, [
                    'maxOutputTokens'
                ], fromMaxOutputTokens);
                const fromStopSequences = getValueByPath(fromObject, [
                    'stopSequences'
                ]);
                if (fromStopSequences != null) setValueByPath(toObject, [
                    'stopSequences'
                ], fromStopSequences);
                const fromResponseLogprobs = getValueByPath(fromObject, [
                    'responseLogprobs'
                ]);
                if (fromResponseLogprobs != null) setValueByPath(toObject, [
                    'responseLogprobs'
                ], fromResponseLogprobs);
                const fromLogprobs = getValueByPath(fromObject, [
                    'logprobs'
                ]);
                if (fromLogprobs != null) setValueByPath(toObject, [
                    'logprobs'
                ], fromLogprobs);
                const fromPresencePenalty = getValueByPath(fromObject, [
                    'presencePenalty'
                ]);
                if (fromPresencePenalty != null) setValueByPath(toObject, [
                    'presencePenalty'
                ], fromPresencePenalty);
                const fromFrequencyPenalty = getValueByPath(fromObject, [
                    'frequencyPenalty'
                ]);
                if (fromFrequencyPenalty != null) setValueByPath(toObject, [
                    'frequencyPenalty'
                ], fromFrequencyPenalty);
                const fromSeed = getValueByPath(fromObject, [
                    'seed'
                ]);
                if (fromSeed != null) setValueByPath(toObject, [
                    'seed'
                ], fromSeed);
                const fromResponseMimeType = getValueByPath(fromObject, [
                    'responseMimeType'
                ]);
                if (fromResponseMimeType != null) setValueByPath(toObject, [
                    'responseMimeType'
                ], fromResponseMimeType);
                const fromResponseSchema = getValueByPath(fromObject, [
                    'responseSchema'
                ]);
                if (fromResponseSchema != null) setValueByPath(toObject, [
                    'responseSchema'
                ], tSchema(fromResponseSchema));
                const fromResponseJsonSchema = getValueByPath(fromObject, [
                    'responseJsonSchema'
                ]);
                if (fromResponseJsonSchema != null) setValueByPath(toObject, [
                    'responseJsonSchema'
                ], fromResponseJsonSchema);
                if (getValueByPath(fromObject, [
                    'routingConfig'
                ]) !== undefined) throw new Error('routingConfig parameter is not supported in Gemini API.');
                if (getValueByPath(fromObject, [
                    'modelSelectionConfig'
                ]) !== undefined) throw new Error('modelSelectionConfig parameter is not supported in Gemini API.');
                const fromSafetySettings = getValueByPath(fromObject, [
                    'safetySettings'
                ]);
                if (parentObject !== undefined && fromSafetySettings != null) {
                    let transformedList = fromSafetySettings;
                    if (Array.isArray(transformedList)) transformedList = transformedList.map((item)=>{
                        return safetySettingToMldev$1(item);
                    });
                    setValueByPath(parentObject, [
                        'safetySettings'
                    ], transformedList);
                }
                const fromTools = getValueByPath(fromObject, [
                    'tools'
                ]);
                if (parentObject !== undefined && fromTools != null) {
                    let transformedList = tTools(fromTools);
                    if (Array.isArray(transformedList)) transformedList = transformedList.map((item)=>{
                        return toolToMldev$4(tTool(item));
                    });
                    setValueByPath(parentObject, [
                        'tools'
                    ], transformedList);
                }
                const fromToolConfig = getValueByPath(fromObject, [
                    'toolConfig'
                ]);
                if (parentObject !== undefined && fromToolConfig != null) setValueByPath(parentObject, [
                    'toolConfig'
                ], toolConfigToMldev$2(fromToolConfig));
                if (getValueByPath(fromObject, [
                    'labels'
                ]) !== undefined) throw new Error('labels parameter is not supported in Gemini API.');
                const fromCachedContent = getValueByPath(fromObject, [
                    'cachedContent'
                ]);
                if (parentObject !== undefined && fromCachedContent != null) setValueByPath(parentObject, [
                    'cachedContent'
                ], tCachedContentName(apiClient, fromCachedContent));
                const fromResponseModalities = getValueByPath(fromObject, [
                    'responseModalities'
                ]);
                if (fromResponseModalities != null) setValueByPath(toObject, [
                    'responseModalities'
                ], fromResponseModalities);
                const fromMediaResolution = getValueByPath(fromObject, [
                    'mediaResolution'
                ]);
                if (fromMediaResolution != null) setValueByPath(toObject, [
                    'mediaResolution'
                ], fromMediaResolution);
                const fromSpeechConfig = getValueByPath(fromObject, [
                    'speechConfig'
                ]);
                if (fromSpeechConfig != null) setValueByPath(toObject, [
                    'speechConfig'
                ], tSpeechConfig(fromSpeechConfig));
                if (getValueByPath(fromObject, [
                    'audioTimestamp'
                ]) !== undefined) throw new Error('audioTimestamp parameter is not supported in Gemini API.');
                const fromThinkingConfig = getValueByPath(fromObject, [
                    'thinkingConfig'
                ]);
                if (fromThinkingConfig != null) setValueByPath(toObject, [
                    'thinkingConfig'
                ], fromThinkingConfig);
                const fromImageConfig = getValueByPath(fromObject, [
                    'imageConfig'
                ]);
                if (fromImageConfig != null) setValueByPath(toObject, [
                    'imageConfig'
                ], imageConfigToMldev$1(fromImageConfig));
                const fromEnableEnhancedCivicAnswers = getValueByPath(fromObject, [
                    'enableEnhancedCivicAnswers'
                ]);
                if (fromEnableEnhancedCivicAnswers != null) setValueByPath(toObject, [
                    'enableEnhancedCivicAnswers'
                ], fromEnableEnhancedCivicAnswers);
                return toObject;
            }
            function generateContentResponseFromMldev$1(fromObject) {
                const toObject = {};
                const fromSdkHttpResponse = getValueByPath(fromObject, [
                    'sdkHttpResponse'
                ]);
                if (fromSdkHttpResponse != null) setValueByPath(toObject, [
                    'sdkHttpResponse'
                ], fromSdkHttpResponse);
                const fromCandidates = getValueByPath(fromObject, [
                    'candidates'
                ]);
                if (fromCandidates != null) {
                    let transformedList = fromCandidates;
                    if (Array.isArray(transformedList)) transformedList = transformedList.map((item)=>{
                        return candidateFromMldev$1(item);
                    });
                    setValueByPath(toObject, [
                        'candidates'
                    ], transformedList);
                }
                const fromModelVersion = getValueByPath(fromObject, [
                    'modelVersion'
                ]);
                if (fromModelVersion != null) setValueByPath(toObject, [
                    'modelVersion'
                ], fromModelVersion);
                const fromPromptFeedback = getValueByPath(fromObject, [
                    'promptFeedback'
                ]);
                if (fromPromptFeedback != null) setValueByPath(toObject, [
                    'promptFeedback'
                ], fromPromptFeedback);
                const fromResponseId = getValueByPath(fromObject, [
                    'responseId'
                ]);
                if (fromResponseId != null) setValueByPath(toObject, [
                    'responseId'
                ], fromResponseId);
                const fromUsageMetadata = getValueByPath(fromObject, [
                    'usageMetadata'
                ]);
                if (fromUsageMetadata != null) setValueByPath(toObject, [
                    'usageMetadata'
                ], fromUsageMetadata);
                return toObject;
            }
            function getBatchJobParametersToMldev(apiClient, fromObject) {
                const toObject = {};
                const fromName = getValueByPath(fromObject, [
                    'name'
                ]);
                if (fromName != null) setValueByPath(toObject, [
                    '_url',
                    'name'
                ], tBatchJobName(apiClient, fromName));
                return toObject;
            }
            function getBatchJobParametersToVertex(apiClient, fromObject) {
                const toObject = {};
                const fromName = getValueByPath(fromObject, [
                    'name'
                ]);
                if (fromName != null) setValueByPath(toObject, [
                    '_url',
                    'name'
                ], tBatchJobName(apiClient, fromName));
                return toObject;
            }
            function googleMapsToMldev$4(fromObject) {
                const toObject = {};
                if (getValueByPath(fromObject, [
                    'authConfig'
                ]) !== undefined) throw new Error('authConfig parameter is not supported in Gemini API.');
                const fromEnableWidget = getValueByPath(fromObject, [
                    'enableWidget'
                ]);
                if (fromEnableWidget != null) setValueByPath(toObject, [
                    'enableWidget'
                ], fromEnableWidget);
                return toObject;
            }
            function googleSearchToMldev$4(fromObject) {
                const toObject = {};
                if (getValueByPath(fromObject, [
                    'excludeDomains'
                ]) !== undefined) throw new Error('excludeDomains parameter is not supported in Gemini API.');
                if (getValueByPath(fromObject, [
                    'blockingConfidence'
                ]) !== undefined) throw new Error('blockingConfidence parameter is not supported in Gemini API.');
                const fromTimeRangeFilter = getValueByPath(fromObject, [
                    'timeRangeFilter'
                ]);
                if (fromTimeRangeFilter != null) setValueByPath(toObject, [
                    'timeRangeFilter'
                ], fromTimeRangeFilter);
                return toObject;
            }
            function imageConfigToMldev$1(fromObject) {
                const toObject = {};
                const fromAspectRatio = getValueByPath(fromObject, [
                    'aspectRatio'
                ]);
                if (fromAspectRatio != null) setValueByPath(toObject, [
                    'aspectRatio'
                ], fromAspectRatio);
                const fromImageSize = getValueByPath(fromObject, [
                    'imageSize'
                ]);
                if (fromImageSize != null) setValueByPath(toObject, [
                    'imageSize'
                ], fromImageSize);
                if (getValueByPath(fromObject, [
                    'outputMimeType'
                ]) !== undefined) throw new Error('outputMimeType parameter is not supported in Gemini API.');
                if (getValueByPath(fromObject, [
                    'outputCompressionQuality'
                ]) !== undefined) throw new Error('outputCompressionQuality parameter is not supported in Gemini API.');
                return toObject;
            }
            function inlinedRequestToMldev(apiClient, fromObject) {
                const toObject = {};
                const fromModel = getValueByPath(fromObject, [
                    'model'
                ]);
                if (fromModel != null) setValueByPath(toObject, [
                    'request',
                    'model'
                ], tModel(apiClient, fromModel));
                const fromContents = getValueByPath(fromObject, [
                    'contents'
                ]);
                if (fromContents != null) {
                    let transformedList = tContents(fromContents);
                    if (Array.isArray(transformedList)) transformedList = transformedList.map((item)=>{
                        return contentToMldev$4(item);
                    });
                    setValueByPath(toObject, [
                        'request',
                        'contents'
                    ], transformedList);
                }
                const fromMetadata = getValueByPath(fromObject, [
                    'metadata'
                ]);
                if (fromMetadata != null) setValueByPath(toObject, [
                    'metadata'
                ], fromMetadata);
                const fromConfig = getValueByPath(fromObject, [
                    'config'
                ]);
                if (fromConfig != null) setValueByPath(toObject, [
                    'request',
                    'generationConfig'
                ], generateContentConfigToMldev$1(apiClient, fromConfig, getValueByPath(toObject, [
                    'request'
                ], {})));
                return toObject;
            }
            function inlinedResponseFromMldev(fromObject) {
                const toObject = {};
                const fromResponse = getValueByPath(fromObject, [
                    'response'
                ]);
                if (fromResponse != null) setValueByPath(toObject, [
                    'response'
                ], generateContentResponseFromMldev$1(fromResponse));
                const fromError = getValueByPath(fromObject, [
                    'error'
                ]);
                if (fromError != null) setValueByPath(toObject, [
                    'error'
                ], fromError);
                return toObject;
            }
            function listBatchJobsConfigToMldev(fromObject, parentObject) {
                const toObject = {};
                const fromPageSize = getValueByPath(fromObject, [
                    'pageSize'
                ]);
                if (parentObject !== undefined && fromPageSize != null) setValueByPath(parentObject, [
                    '_query',
                    'pageSize'
                ], fromPageSize);
                const fromPageToken = getValueByPath(fromObject, [
                    'pageToken'
                ]);
                if (parentObject !== undefined && fromPageToken != null) setValueByPath(parentObject, [
                    '_query',
                    'pageToken'
                ], fromPageToken);
                if (getValueByPath(fromObject, [
                    'filter'
                ]) !== undefined) throw new Error('filter parameter is not supported in Gemini API.');
                return toObject;
            }
            function listBatchJobsConfigToVertex(fromObject, parentObject) {
                const toObject = {};
                const fromPageSize = getValueByPath(fromObject, [
                    'pageSize'
                ]);
                if (parentObject !== undefined && fromPageSize != null) setValueByPath(parentObject, [
                    '_query',
                    'pageSize'
                ], fromPageSize);
                const fromPageToken = getValueByPath(fromObject, [
                    'pageToken'
                ]);
                if (parentObject !== undefined && fromPageToken != null) setValueByPath(parentObject, [
                    '_query',
                    'pageToken'
                ], fromPageToken);
                const fromFilter = getValueByPath(fromObject, [
                    'filter'
                ]);
                if (parentObject !== undefined && fromFilter != null) setValueByPath(parentObject, [
                    '_query',
                    'filter'
                ], fromFilter);
                return toObject;
            }
            function listBatchJobsParametersToMldev(fromObject) {
                const toObject = {};
                const fromConfig = getValueByPath(fromObject, [
                    'config'
                ]);
                if (fromConfig != null) listBatchJobsConfigToMldev(fromConfig, toObject);
                return toObject;
            }
            function listBatchJobsParametersToVertex(fromObject) {
                const toObject = {};
                const fromConfig = getValueByPath(fromObject, [
                    'config'
                ]);
                if (fromConfig != null) listBatchJobsConfigToVertex(fromConfig, toObject);
                return toObject;
            }
            function listBatchJobsResponseFromMldev(fromObject) {
                const toObject = {};
                const fromSdkHttpResponse = getValueByPath(fromObject, [
                    'sdkHttpResponse'
                ]);
                if (fromSdkHttpResponse != null) setValueByPath(toObject, [
                    'sdkHttpResponse'
                ], fromSdkHttpResponse);
                const fromNextPageToken = getValueByPath(fromObject, [
                    'nextPageToken'
                ]);
                if (fromNextPageToken != null) setValueByPath(toObject, [
                    'nextPageToken'
                ], fromNextPageToken);
                const fromBatchJobs = getValueByPath(fromObject, [
                    'operations'
                ]);
                if (fromBatchJobs != null) {
                    let transformedList = fromBatchJobs;
                    if (Array.isArray(transformedList)) transformedList = transformedList.map((item)=>{
                        return batchJobFromMldev(item);
                    });
                    setValueByPath(toObject, [
                        'batchJobs'
                    ], transformedList);
                }
                return toObject;
            }
            function listBatchJobsResponseFromVertex(fromObject) {
                const toObject = {};
                const fromSdkHttpResponse = getValueByPath(fromObject, [
                    'sdkHttpResponse'
                ]);
                if (fromSdkHttpResponse != null) setValueByPath(toObject, [
                    'sdkHttpResponse'
                ], fromSdkHttpResponse);
                const fromNextPageToken = getValueByPath(fromObject, [
                    'nextPageToken'
                ]);
                if (fromNextPageToken != null) setValueByPath(toObject, [
                    'nextPageToken'
                ], fromNextPageToken);
                const fromBatchJobs = getValueByPath(fromObject, [
                    'batchPredictionJobs'
                ]);
                if (fromBatchJobs != null) {
                    let transformedList = fromBatchJobs;
                    if (Array.isArray(transformedList)) transformedList = transformedList.map((item)=>{
                        return batchJobFromVertex(item);
                    });
                    setValueByPath(toObject, [
                        'batchJobs'
                    ], transformedList);
                }
                return toObject;
            }
            function partToMldev$4(fromObject) {
                const toObject = {};
                const fromMediaResolution = getValueByPath(fromObject, [
                    'mediaResolution'
                ]);
                if (fromMediaResolution != null) setValueByPath(toObject, [
                    'mediaResolution'
                ], fromMediaResolution);
                const fromCodeExecutionResult = getValueByPath(fromObject, [
                    'codeExecutionResult'
                ]);
                if (fromCodeExecutionResult != null) setValueByPath(toObject, [
                    'codeExecutionResult'
                ], fromCodeExecutionResult);
                const fromExecutableCode = getValueByPath(fromObject, [
                    'executableCode'
                ]);
                if (fromExecutableCode != null) setValueByPath(toObject, [
                    'executableCode'
                ], fromExecutableCode);
                const fromFileData = getValueByPath(fromObject, [
                    'fileData'
                ]);
                if (fromFileData != null) setValueByPath(toObject, [
                    'fileData'
                ], fileDataToMldev$4(fromFileData));
                const fromFunctionCall = getValueByPath(fromObject, [
                    'functionCall'
                ]);
                if (fromFunctionCall != null) setValueByPath(toObject, [
                    'functionCall'
                ], functionCallToMldev$4(fromFunctionCall));
                const fromFunctionResponse = getValueByPath(fromObject, [
                    'functionResponse'
                ]);
                if (fromFunctionResponse != null) setValueByPath(toObject, [
                    'functionResponse'
                ], fromFunctionResponse);
                const fromInlineData = getValueByPath(fromObject, [
                    'inlineData'
                ]);
                if (fromInlineData != null) setValueByPath(toObject, [
                    'inlineData'
                ], blobToMldev$4(fromInlineData));
                const fromText = getValueByPath(fromObject, [
                    'text'
                ]);
                if (fromText != null) setValueByPath(toObject, [
                    'text'
                ], fromText);
                const fromThought = getValueByPath(fromObject, [
                    'thought'
                ]);
                if (fromThought != null) setValueByPath(toObject, [
                    'thought'
                ], fromThought);
                const fromThoughtSignature = getValueByPath(fromObject, [
                    'thoughtSignature'
                ]);
                if (fromThoughtSignature != null) setValueByPath(toObject, [
                    'thoughtSignature'
                ], fromThoughtSignature);
                const fromVideoMetadata = getValueByPath(fromObject, [
                    'videoMetadata'
                ]);
                if (fromVideoMetadata != null) setValueByPath(toObject, [
                    'videoMetadata'
                ], fromVideoMetadata);
                return toObject;
            }
            function safetySettingToMldev$1(fromObject) {
                const toObject = {};
                const fromCategory = getValueByPath(fromObject, [
                    'category'
                ]);
                if (fromCategory != null) setValueByPath(toObject, [
                    'category'
                ], fromCategory);
                if (getValueByPath(fromObject, [
                    'method'
                ]) !== undefined) throw new Error('method parameter is not supported in Gemini API.');
                const fromThreshold = getValueByPath(fromObject, [
                    'threshold'
                ]);
                if (fromThreshold != null) setValueByPath(toObject, [
                    'threshold'
                ], fromThreshold);
                return toObject;
            }
            function toolConfigToMldev$2(fromObject) {
                const toObject = {};
                const fromFunctionCallingConfig = getValueByPath(fromObject, [
                    'functionCallingConfig'
                ]);
                if (fromFunctionCallingConfig != null) setValueByPath(toObject, [
                    'functionCallingConfig'
                ], functionCallingConfigToMldev$2(fromFunctionCallingConfig));
                const fromRetrievalConfig = getValueByPath(fromObject, [
                    'retrievalConfig'
                ]);
                if (fromRetrievalConfig != null) setValueByPath(toObject, [
                    'retrievalConfig'
                ], fromRetrievalConfig);
                return toObject;
            }
            function toolToMldev$4(fromObject) {
                const toObject = {};
                const fromFunctionDeclarations = getValueByPath(fromObject, [
                    'functionDeclarations'
                ]);
                if (fromFunctionDeclarations != null) {
                    let transformedList = fromFunctionDeclarations;
                    if (Array.isArray(transformedList)) transformedList = transformedList.map((item)=>{
                        return item;
                    });
                    setValueByPath(toObject, [
                        'functionDeclarations'
                    ], transformedList);
                }
                if (getValueByPath(fromObject, [
                    'retrieval'
                ]) !== undefined) throw new Error('retrieval parameter is not supported in Gemini API.');
                const fromGoogleSearchRetrieval = getValueByPath(fromObject, [
                    'googleSearchRetrieval'
                ]);
                if (fromGoogleSearchRetrieval != null) setValueByPath(toObject, [
                    'googleSearchRetrieval'
                ], fromGoogleSearchRetrieval);
                const fromComputerUse = getValueByPath(fromObject, [
                    'computerUse'
                ]);
                if (fromComputerUse != null) setValueByPath(toObject, [
                    'computerUse'
                ], fromComputerUse);
                const fromFileSearch = getValueByPath(fromObject, [
                    'fileSearch'
                ]);
                if (fromFileSearch != null) setValueByPath(toObject, [
                    'fileSearch'
                ], fromFileSearch);
                const fromCodeExecution = getValueByPath(fromObject, [
                    'codeExecution'
                ]);
                if (fromCodeExecution != null) setValueByPath(toObject, [
                    'codeExecution'
                ], fromCodeExecution);
                if (getValueByPath(fromObject, [
                    'enterpriseWebSearch'
                ]) !== undefined) throw new Error('enterpriseWebSearch parameter is not supported in Gemini API.');
                const fromGoogleMaps = getValueByPath(fromObject, [
                    'googleMaps'
                ]);
                if (fromGoogleMaps != null) setValueByPath(toObject, [
                    'googleMaps'
                ], googleMapsToMldev$4(fromGoogleMaps));
                const fromGoogleSearch = getValueByPath(fromObject, [
                    'googleSearch'
                ]);
                if (fromGoogleSearch != null) setValueByPath(toObject, [
                    'googleSearch'
                ], googleSearchToMldev$4(fromGoogleSearch));
                const fromUrlContext = getValueByPath(fromObject, [
                    'urlContext'
                ]);
                if (fromUrlContext != null) setValueByPath(toObject, [
                    'urlContext'
                ], fromUrlContext);
                return toObject;
            }
            var PagedItem;
            (function(PagedItem) {
                PagedItem["PAGED_ITEM_BATCH_JOBS"] = "batchJobs";
                PagedItem["PAGED_ITEM_MODELS"] = "models";
                PagedItem["PAGED_ITEM_TUNING_JOBS"] = "tuningJobs";
                PagedItem["PAGED_ITEM_FILES"] = "files";
                PagedItem["PAGED_ITEM_CACHED_CONTENTS"] = "cachedContents";
                PagedItem["PAGED_ITEM_FILE_SEARCH_STORES"] = "fileSearchStores";
                PagedItem["PAGED_ITEM_DOCUMENTS"] = "documents";
            })(PagedItem || (PagedItem = {}));
            class Pager {
                constructor(name, request, response, params){
                    this.pageInternal = [];
                    this.paramsInternal = {};
                    this.requestInternal = request;
                    this.init(name, response, params);
                }
                init(name, response, params) {
                    var _a, _b;
                    this.nameInternal = name;
                    this.pageInternal = response[this.nameInternal] || [];
                    this.sdkHttpResponseInternal = response === null || response === void 0 ? void 0 : response.sdkHttpResponse;
                    this.idxInternal = 0;
                    let requestParams = {
                        config: {}
                    };
                    if (!params || Object.keys(params).length === 0) requestParams = {
                        config: {}
                    };
                    else if (typeof params === 'object') requestParams = Object.assign({}, params);
                    else requestParams = params;
                    if (requestParams['config']) requestParams['config']['pageToken'] = response['nextPageToken'];
                    this.paramsInternal = requestParams;
                    this.pageInternalSize = (_b = (_a = requestParams['config']) === null || _a === void 0 ? void 0 : _a['pageSize']) !== null && _b !== void 0 ? _b : this.pageInternal.length;
                }
                initNextPage(response) {
                    this.init(this.nameInternal, response, this.paramsInternal);
                }
                get page() {
                    return this.pageInternal;
                }
                get name() {
                    return this.nameInternal;
                }
                get pageSize() {
                    return this.pageInternalSize;
                }
                get sdkHttpResponse() {
                    return this.sdkHttpResponseInternal;
                }
                get params() {
                    return this.paramsInternal;
                }
                get pageLength() {
                    return this.pageInternal.length;
                }
                getItem(index) {
                    return this.pageInternal[index];
                }
                [Symbol.asyncIterator]() {
                    return {
                        next: async ()=>{
                            if (this.idxInternal >= this.pageLength) {
                                if (this.hasNextPage()) await this.nextPage();
                                else return {
                                    value: undefined,
                                    done: true
                                };
                            }
                            const item = this.getItem(this.idxInternal);
                            this.idxInternal += 1;
                            return {
                                value: item,
                                done: false
                            };
                        },
                        return: async ()=>{
                            return {
                                value: undefined,
                                done: true
                            };
                        }
                    };
                }
                async nextPage() {
                    if (!this.hasNextPage()) throw new Error('No more pages to fetch.');
                    const response = await this.requestInternal(this.params);
                    this.initNextPage(response);
                    return this.page;
                }
                hasNextPage() {
                    var _a;
                    if (((_a = this.params['config']) === null || _a === void 0 ? void 0 : _a['pageToken']) !== undefined) return true;
                    return false;
                }
            }
            class Batches extends BaseModule {
                constructor(apiClient){
                    super();
                    this.apiClient = apiClient;
                    this.list = async (params = {})=>{
                        return new Pager(PagedItem.PAGED_ITEM_BATCH_JOBS, (x)=>this.listInternal(x), await this.listInternal(params), params);
                    };
                    this.create = async (params)=>{
                        if (this.apiClient.isVertexAI()) params.config = this.formatDestination(params.src, params.config);
                        return this.createInternal(params);
                    };
                    this.createEmbeddings = async (params)=>{
                        console.warn('batches.createEmbeddings() is experimental and may change without notice.');
                        if (this.apiClient.isVertexAI()) throw new Error('Vertex AI does not support batches.createEmbeddings.');
                        return this.createEmbeddingsInternal(params);
                    };
                }
                createInlinedGenerateContentRequest(params) {
                    const body = createBatchJobParametersToMldev(this.apiClient, params);
                    const urlParams = body['_url'];
                    const path = formatMap('{model}:batchGenerateContent', urlParams);
                    const batch = body['batch'];
                    const inputConfig = batch['inputConfig'];
                    const requestsWrapper = inputConfig['requests'];
                    const requests = requestsWrapper['requests'];
                    const newRequests = [];
                    for (const request of requests){
                        const requestDict = Object.assign({}, request);
                        if (requestDict['systemInstruction']) {
                            const systemInstructionValue = requestDict['systemInstruction'];
                            delete requestDict['systemInstruction'];
                            const requestContent = requestDict['request'];
                            requestContent['systemInstruction'] = systemInstructionValue;
                            requestDict['request'] = requestContent;
                        }
                        newRequests.push(requestDict);
                    }
                    requestsWrapper['requests'] = newRequests;
                    delete body['config'];
                    delete body['_url'];
                    delete body['_query'];
                    return {
                        path,
                        body
                    };
                }
                getGcsUri(src) {
                    if (typeof src === 'string') return src.startsWith('gs://') ? src : undefined;
                    if (!Array.isArray(src) && src.gcsUri && src.gcsUri.length > 0) return src.gcsUri[0];
                    return undefined;
                }
                getBigqueryUri(src) {
                    if (typeof src === 'string') return src.startsWith('bq://') ? src : undefined;
                    if (!Array.isArray(src)) return src.bigqueryUri;
                    return undefined;
                }
                formatDestination(src, config) {
                    const newConfig = config ? Object.assign({}, config) : {};
                    const timestampStr = Date.now().toString();
                    if (!newConfig.displayName) newConfig.displayName = `genaiBatchJob_${timestampStr}`;
                    if (newConfig.dest === undefined) {
                        const gcsUri = this.getGcsUri(src);
                        const bigqueryUri = this.getBigqueryUri(src);
                        if (gcsUri) {
                            if (gcsUri.endsWith('.jsonl')) newConfig.dest = `${gcsUri.slice(0, -6)}/dest`;
                            else newConfig.dest = `${gcsUri}_dest_${timestampStr}`;
                        } else if (bigqueryUri) newConfig.dest = `${bigqueryUri}_dest_${timestampStr}`;
                        else throw new Error('Unsupported source for Vertex AI: No GCS or BigQuery URI found.');
                    }
                    return newConfig;
                }
                async createInternal(params) {
                    var _a, _b, _c, _d;
                    let response;
                    let path = '';
                    let queryParams = {};
                    if (this.apiClient.isVertexAI()) {
                        const body = createBatchJobParametersToVertex(this.apiClient, params);
                        path = formatMap('batchPredictionJobs', body['_url']);
                        queryParams = body['_query'];
                        delete body['_url'];
                        delete body['_query'];
                        response = this.apiClient.request({
                            path: path,
                            queryParams: queryParams,
                            body: JSON.stringify(body),
                            httpMethod: 'POST',
                            httpOptions: (_a = params.config) === null || _a === void 0 ? void 0 : _a.httpOptions,
                            abortSignal: (_b = params.config) === null || _b === void 0 ? void 0 : _b.abortSignal
                        }).then((httpResponse)=>{
                            return httpResponse.json();
                        });
                        return response.then((apiResponse)=>{
                            const resp = batchJobFromVertex(apiResponse);
                            return resp;
                        });
                    } else {
                        const body = createBatchJobParametersToMldev(this.apiClient, params);
                        path = formatMap('{model}:batchGenerateContent', body['_url']);
                        queryParams = body['_query'];
                        delete body['_url'];
                        delete body['_query'];
                        response = this.apiClient.request({
                            path: path,
                            queryParams: queryParams,
                            body: JSON.stringify(body),
                            httpMethod: 'POST',
                            httpOptions: (_c = params.config) === null || _c === void 0 ? void 0 : _c.httpOptions,
                            abortSignal: (_d = params.config) === null || _d === void 0 ? void 0 : _d.abortSignal
                        }).then((httpResponse)=>{
                            return httpResponse.json();
                        });
                        return response.then((apiResponse)=>{
                            const resp = batchJobFromMldev(apiResponse);
                            return resp;
                        });
                    }
                }
                async createEmbeddingsInternal(params) {
                    var _a, _b;
                    let response;
                    let path = '';
                    let queryParams = {};
                    if (this.apiClient.isVertexAI()) throw new Error('This method is only supported by the Gemini Developer API.');
                    else {
                        const body = createEmbeddingsBatchJobParametersToMldev(this.apiClient, params);
                        path = formatMap('{model}:asyncBatchEmbedContent', body['_url']);
                        queryParams = body['_query'];
                        delete body['_url'];
                        delete body['_query'];
                        response = this.apiClient.request({
                            path: path,
                            queryParams: queryParams,
                            body: JSON.stringify(body),
                            httpMethod: 'POST',
                            httpOptions: (_a = params.config) === null || _a === void 0 ? void 0 : _a.httpOptions,
                            abortSignal: (_b = params.config) === null || _b === void 0 ? void 0 : _b.abortSignal
                        }).then((httpResponse)=>{
                            return httpResponse.json();
                        });
                        return response.then((apiResponse)=>{
                            const resp = batchJobFromMldev(apiResponse);
                            return resp;
                        });
                    }
                }
                async get(params) {
                    var _a, _b, _c, _d;
                    let response;
                    let path = '';
                    let queryParams = {};
                    if (this.apiClient.isVertexAI()) {
                        const body = getBatchJobParametersToVertex(this.apiClient, params);
                        path = formatMap('batchPredictionJobs/{name}', body['_url']);
                        queryParams = body['_query'];
                        delete body['_url'];
                        delete body['_query'];
                        response = this.apiClient.request({
                            path: path,
                            queryParams: queryParams,
                            body: JSON.stringify(body),
                            httpMethod: 'GET',
                            httpOptions: (_a = params.config) === null || _a === void 0 ? void 0 : _a.httpOptions,
                            abortSignal: (_b = params.config) === null || _b === void 0 ? void 0 : _b.abortSignal
                        }).then((httpResponse)=>{
                            return httpResponse.json();
                        });
                        return response.then((apiResponse)=>{
                            const resp = batchJobFromVertex(apiResponse);
                            return resp;
                        });
                    } else {
                        const body = getBatchJobParametersToMldev(this.apiClient, params);
                        path = formatMap('batches/{name}', body['_url']);
                        queryParams = body['_query'];
                        delete body['_url'];
                        delete body['_query'];
                        response = this.apiClient.request({
                            path: path,
                            queryParams: queryParams,
                            body: JSON.stringify(body),
                            httpMethod: 'GET',
                            httpOptions: (_c = params.config) === null || _c === void 0 ? void 0 : _c.httpOptions,
                            abortSignal: (_d = params.config) === null || _d === void 0 ? void 0 : _d.abortSignal
                        }).then((httpResponse)=>{
                            return httpResponse.json();
                        });
                        return response.then((apiResponse)=>{
                            const resp = batchJobFromMldev(apiResponse);
                            return resp;
                        });
                    }
                }
                async cancel(params) {
                    var _a, _b, _c, _d;
                    let path = '';
                    let queryParams = {};
                    if (this.apiClient.isVertexAI()) {
                        const body = cancelBatchJobParametersToVertex(this.apiClient, params);
                        path = formatMap('batchPredictionJobs/{name}:cancel', body['_url']);
                        queryParams = body['_query'];
                        delete body['_url'];
                        delete body['_query'];
                        await this.apiClient.request({
                            path: path,
                            queryParams: queryParams,
                            body: JSON.stringify(body),
                            httpMethod: 'POST',
                            httpOptions: (_a = params.config) === null || _a === void 0 ? void 0 : _a.httpOptions,
                            abortSignal: (_b = params.config) === null || _b === void 0 ? void 0 : _b.abortSignal
                        });
                    } else {
                        const body = cancelBatchJobParametersToMldev(this.apiClient, params);
                        path = formatMap('batches/{name}:cancel', body['_url']);
                        queryParams = body['_query'];
                        delete body['_url'];
                        delete body['_query'];
                        await this.apiClient.request({
                            path: path,
                            queryParams: queryParams,
                            body: JSON.stringify(body),
                            httpMethod: 'POST',
                            httpOptions: (_c = params.config) === null || _c === void 0 ? void 0 : _c.httpOptions,
                            abortSignal: (_d = params.config) === null || _d === void 0 ? void 0 : _d.abortSignal
                        });
                    }
                }
                async listInternal(params) {
                    var _a, _b, _c, _d;
                    let response;
                    let path = '';
                    let queryParams = {};
                    if (this.apiClient.isVertexAI()) {
                        const body = listBatchJobsParametersToVertex(params);
                        path = formatMap('batchPredictionJobs', body['_url']);
                        queryParams = body['_query'];
                        delete body['_url'];
                        delete body['_query'];
                        response = this.apiClient.request({
                            path: path,
                            queryParams: queryParams,
                            body: JSON.stringify(body),
                            httpMethod: 'GET',
                            httpOptions: (_a = params.config) === null || _a === void 0 ? void 0 : _a.httpOptions,
                            abortSignal: (_b = params.config) === null || _b === void 0 ? void 0 : _b.abortSignal
                        }).then((httpResponse)=>{
                            return httpResponse.json().then((jsonResponse)=>{
                                const response = jsonResponse;
                                response.sdkHttpResponse = {
                                    headers: httpResponse.headers
                                };
                                return response;
                            });
                        });
                        return response.then((apiResponse)=>{
                            const resp = listBatchJobsResponseFromVertex(apiResponse);
                            const typedResp = new ListBatchJobsResponse();
                            Object.assign(typedResp, resp);
                            return typedResp;
                        });
                    } else {
                        const body = listBatchJobsParametersToMldev(params);
                        path = formatMap('batches', body['_url']);
                        queryParams = body['_query'];
                        delete body['_url'];
                        delete body['_query'];
                        response = this.apiClient.request({
                            path: path,
                            queryParams: queryParams,
                            body: JSON.stringify(body),
                            httpMethod: 'GET',
                            httpOptions: (_c = params.config) === null || _c === void 0 ? void 0 : _c.httpOptions,
                            abortSignal: (_d = params.config) === null || _d === void 0 ? void 0 : _d.abortSignal
                        }).then((httpResponse)=>{
                            return httpResponse.json().then((jsonResponse)=>{
                                const response = jsonResponse;
                                response.sdkHttpResponse = {
                                    headers: httpResponse.headers
                                };
                                return response;
                            });
                        });
                        return response.then((apiResponse)=>{
                            const resp = listBatchJobsResponseFromMldev(apiResponse);
                            const typedResp = new ListBatchJobsResponse();
                            Object.assign(typedResp, resp);
                            return typedResp;
                        });
                    }
                }
                async delete(params) {
                    var _a, _b, _c, _d;
                    let response;
                    let path = '';
                    let queryParams = {};
                    if (this.apiClient.isVertexAI()) {
                        const body = deleteBatchJobParametersToVertex(this.apiClient, params);
                        path = formatMap('batchPredictionJobs/{name}', body['_url']);
                        queryParams = body['_query'];
                        delete body['_url'];
                        delete body['_query'];
                        response = this.apiClient.request({
                            path: path,
                            queryParams: queryParams,
                            body: JSON.stringify(body),
                            httpMethod: 'DELETE',
                            httpOptions: (_a = params.config) === null || _a === void 0 ? void 0 : _a.httpOptions,
                            abortSignal: (_b = params.config) === null || _b === void 0 ? void 0 : _b.abortSignal
                        }).then((httpResponse)=>{
                            return httpResponse.json().then((jsonResponse)=>{
                                const response = jsonResponse;
                                response.sdkHttpResponse = {
                                    headers: httpResponse.headers
                                };
                                return response;
                            });
                        });
                        return response.then((apiResponse)=>{
                            const resp = deleteResourceJobFromVertex(apiResponse);
                            return resp;
                        });
                    } else {
                        const body = deleteBatchJobParametersToMldev(this.apiClient, params);
                        path = formatMap('batches/{name}', body['_url']);
                        queryParams = body['_query'];
                        delete body['_url'];
                        delete body['_query'];
                        response = this.apiClient.request({
                            path: path,
                            queryParams: queryParams,
                            body: JSON.stringify(body),
                            httpMethod: 'DELETE',
                            httpOptions: (_c = params.config) === null || _c === void 0 ? void 0 : _c.httpOptions,
                            abortSignal: (_d = params.config) === null || _d === void 0 ? void 0 : _d.abortSignal
                        }).then((httpResponse)=>{
                            return httpResponse.json().then((jsonResponse)=>{
                                const response = jsonResponse;
                                response.sdkHttpResponse = {
                                    headers: httpResponse.headers
                                };
                                return response;
                            });
                        });
                        return response.then((apiResponse)=>{
                            const resp = deleteResourceJobFromMldev(apiResponse);
                            return resp;
                        });
                    }
                }
            }
            function blobToMldev$3(fromObject) {
                const toObject = {};
                const fromData = getValueByPath(fromObject, [
                    'data'
                ]);
                if (fromData != null) setValueByPath(toObject, [
                    'data'
                ], fromData);
                if (getValueByPath(fromObject, [
                    'displayName'
                ]) !== undefined) throw new Error('displayName parameter is not supported in Gemini API.');
                const fromMimeType = getValueByPath(fromObject, [
                    'mimeType'
                ]);
                if (fromMimeType != null) setValueByPath(toObject, [
                    'mimeType'
                ], fromMimeType);
                return toObject;
            }
            function contentToMldev$3(fromObject) {
                const toObject = {};
                const fromParts = getValueByPath(fromObject, [
                    'parts'
                ]);
                if (fromParts != null) {
                    let transformedList = fromParts;
                    if (Array.isArray(transformedList)) transformedList = transformedList.map((item)=>{
                        return partToMldev$3(item);
                    });
                    setValueByPath(toObject, [
                        'parts'
                    ], transformedList);
                }
                const fromRole = getValueByPath(fromObject, [
                    'role'
                ]);
                if (fromRole != null) setValueByPath(toObject, [
                    'role'
                ], fromRole);
                return toObject;
            }
            function createCachedContentConfigToMldev(fromObject, parentObject) {
                const toObject = {};
                const fromTtl = getValueByPath(fromObject, [
                    'ttl'
                ]);
                if (parentObject !== undefined && fromTtl != null) setValueByPath(parentObject, [
                    'ttl'
                ], fromTtl);
                const fromExpireTime = getValueByPath(fromObject, [
                    'expireTime'
                ]);
                if (parentObject !== undefined && fromExpireTime != null) setValueByPath(parentObject, [
                    'expireTime'
                ], fromExpireTime);
                const fromDisplayName = getValueByPath(fromObject, [
                    'displayName'
                ]);
                if (parentObject !== undefined && fromDisplayName != null) setValueByPath(parentObject, [
                    'displayName'
                ], fromDisplayName);
                const fromContents = getValueByPath(fromObject, [
                    'contents'
                ]);
                if (parentObject !== undefined && fromContents != null) {
                    let transformedList = tContents(fromContents);
                    if (Array.isArray(transformedList)) transformedList = transformedList.map((item)=>{
                        return contentToMldev$3(item);
                    });
                    setValueByPath(parentObject, [
                        'contents'
                    ], transformedList);
                }
                const fromSystemInstruction = getValueByPath(fromObject, [
                    'systemInstruction'
                ]);
                if (parentObject !== undefined && fromSystemInstruction != null) setValueByPath(parentObject, [
                    'systemInstruction'
                ], contentToMldev$3(tContent(fromSystemInstruction)));
                const fromTools = getValueByPath(fromObject, [
                    'tools'
                ]);
                if (parentObject !== undefined && fromTools != null) {
                    let transformedList = fromTools;
                    if (Array.isArray(transformedList)) transformedList = transformedList.map((item)=>{
                        return toolToMldev$3(item);
                    });
                    setValueByPath(parentObject, [
                        'tools'
                    ], transformedList);
                }
                const fromToolConfig = getValueByPath(fromObject, [
                    'toolConfig'
                ]);
                if (parentObject !== undefined && fromToolConfig != null) setValueByPath(parentObject, [
                    'toolConfig'
                ], toolConfigToMldev$1(fromToolConfig));
                if (getValueByPath(fromObject, [
                    'kmsKeyName'
                ]) !== undefined) throw new Error('kmsKeyName parameter is not supported in Gemini API.');
                return toObject;
            }
            function createCachedContentConfigToVertex(fromObject, parentObject) {
                const toObject = {};
                const fromTtl = getValueByPath(fromObject, [
                    'ttl'
                ]);
                if (parentObject !== undefined && fromTtl != null) setValueByPath(parentObject, [
                    'ttl'
                ], fromTtl);
                const fromExpireTime = getValueByPath(fromObject, [
                    'expireTime'
                ]);
                if (parentObject !== undefined && fromExpireTime != null) setValueByPath(parentObject, [
                    'expireTime'
                ], fromExpireTime);
                const fromDisplayName = getValueByPath(fromObject, [
                    'displayName'
                ]);
                if (parentObject !== undefined && fromDisplayName != null) setValueByPath(parentObject, [
                    'displayName'
                ], fromDisplayName);
                const fromContents = getValueByPath(fromObject, [
                    'contents'
                ]);
                if (parentObject !== undefined && fromContents != null) {
                    let transformedList = tContents(fromContents);
                    if (Array.isArray(transformedList)) transformedList = transformedList.map((item)=>{
                        return item;
                    });
                    setValueByPath(parentObject, [
                        'contents'
                    ], transformedList);
                }
                const fromSystemInstruction = getValueByPath(fromObject, [
                    'systemInstruction'
                ]);
                if (parentObject !== undefined && fromSystemInstruction != null) setValueByPath(parentObject, [
                    'systemInstruction'
                ], tContent(fromSystemInstruction));
                const fromTools = getValueByPath(fromObject, [
                    'tools'
                ]);
                if (parentObject !== undefined && fromTools != null) {
                    let transformedList = fromTools;
                    if (Array.isArray(transformedList)) transformedList = transformedList.map((item)=>{
                        return toolToVertex$2(item);
                    });
                    setValueByPath(parentObject, [
                        'tools'
                    ], transformedList);
                }
                const fromToolConfig = getValueByPath(fromObject, [
                    'toolConfig'
                ]);
                if (parentObject !== undefined && fromToolConfig != null) setValueByPath(parentObject, [
                    'toolConfig'
                ], fromToolConfig);
                const fromKmsKeyName = getValueByPath(fromObject, [
                    'kmsKeyName'
                ]);
                if (parentObject !== undefined && fromKmsKeyName != null) setValueByPath(parentObject, [
                    'encryption_spec',
                    'kmsKeyName'
                ], fromKmsKeyName);
                return toObject;
            }
            function createCachedContentParametersToMldev(apiClient, fromObject) {
                const toObject = {};
                const fromModel = getValueByPath(fromObject, [
                    'model'
                ]);
                if (fromModel != null) setValueByPath(toObject, [
                    'model'
                ], tCachesModel(apiClient, fromModel));
                const fromConfig = getValueByPath(fromObject, [
                    'config'
                ]);
                if (fromConfig != null) createCachedContentConfigToMldev(fromConfig, toObject);
                return toObject;
            }
            function createCachedContentParametersToVertex(apiClient, fromObject) {
                const toObject = {};
                const fromModel = getValueByPath(fromObject, [
                    'model'
                ]);
                if (fromModel != null) setValueByPath(toObject, [
                    'model'
                ], tCachesModel(apiClient, fromModel));
                const fromConfig = getValueByPath(fromObject, [
                    'config'
                ]);
                if (fromConfig != null) createCachedContentConfigToVertex(fromConfig, toObject);
                return toObject;
            }
            function deleteCachedContentParametersToMldev(apiClient, fromObject) {
                const toObject = {};
                const fromName = getValueByPath(fromObject, [
                    'name'
                ]);
                if (fromName != null) setValueByPath(toObject, [
                    '_url',
                    'name'
                ], tCachedContentName(apiClient, fromName));
                return toObject;
            }
            function deleteCachedContentParametersToVertex(apiClient, fromObject) {
                const toObject = {};
                const fromName = getValueByPath(fromObject, [
                    'name'
                ]);
                if (fromName != null) setValueByPath(toObject, [
                    '_url',
                    'name'
                ], tCachedContentName(apiClient, fromName));
                return toObject;
            }
            function deleteCachedContentResponseFromMldev(fromObject) {
                const toObject = {};
                const fromSdkHttpResponse = getValueByPath(fromObject, [
                    'sdkHttpResponse'
                ]);
                if (fromSdkHttpResponse != null) setValueByPath(toObject, [
                    'sdkHttpResponse'
                ], fromSdkHttpResponse);
                return toObject;
            }
            function deleteCachedContentResponseFromVertex(fromObject) {
                const toObject = {};
                const fromSdkHttpResponse = getValueByPath(fromObject, [
                    'sdkHttpResponse'
                ]);
                if (fromSdkHttpResponse != null) setValueByPath(toObject, [
                    'sdkHttpResponse'
                ], fromSdkHttpResponse);
                return toObject;
            }
            function fileDataToMldev$3(fromObject) {
                const toObject = {};
                if (getValueByPath(fromObject, [
                    'displayName'
                ]) !== undefined) throw new Error('displayName parameter is not supported in Gemini API.');
                const fromFileUri = getValueByPath(fromObject, [
                    'fileUri'
                ]);
                if (fromFileUri != null) setValueByPath(toObject, [
                    'fileUri'
                ], fromFileUri);
                const fromMimeType = getValueByPath(fromObject, [
                    'mimeType'
                ]);
                if (fromMimeType != null) setValueByPath(toObject, [
                    'mimeType'
                ], fromMimeType);
                return toObject;
            }
            function functionCallToMldev$3(fromObject) {
                const toObject = {};
                const fromId = getValueByPath(fromObject, [
                    'id'
                ]);
                if (fromId != null) setValueByPath(toObject, [
                    'id'
                ], fromId);
                const fromArgs = getValueByPath(fromObject, [
                    'args'
                ]);
                if (fromArgs != null) setValueByPath(toObject, [
                    'args'
                ], fromArgs);
                const fromName = getValueByPath(fromObject, [
                    'name'
                ]);
                if (fromName != null) setValueByPath(toObject, [
                    'name'
                ], fromName);
                if (getValueByPath(fromObject, [
                    'partialArgs'
                ]) !== undefined) throw new Error('partialArgs parameter is not supported in Gemini API.');
                if (getValueByPath(fromObject, [
                    'willContinue'
                ]) !== undefined) throw new Error('willContinue parameter is not supported in Gemini API.');
                return toObject;
            }
            function functionCallingConfigToMldev$1(fromObject) {
                const toObject = {};
                const fromMode = getValueByPath(fromObject, [
                    'mode'
                ]);
                if (fromMode != null) setValueByPath(toObject, [
                    'mode'
                ], fromMode);
                const fromAllowedFunctionNames = getValueByPath(fromObject, [
                    'allowedFunctionNames'
                ]);
                if (fromAllowedFunctionNames != null) setValueByPath(toObject, [
                    'allowedFunctionNames'
                ], fromAllowedFunctionNames);
                if (getValueByPath(fromObject, [
                    'streamFunctionCallArguments'
                ]) !== undefined) throw new Error('streamFunctionCallArguments parameter is not supported in Gemini API.');
                return toObject;
            }
            function functionDeclarationToVertex$2(fromObject) {
                const toObject = {};
                if (getValueByPath(fromObject, [
                    'behavior'
                ]) !== undefined) throw new Error('behavior parameter is not supported in Vertex AI.');
                const fromDescription = getValueByPath(fromObject, [
                    'description'
                ]);
                if (fromDescription != null) setValueByPath(toObject, [
                    'description'
                ], fromDescription);
                const fromName = getValueByPath(fromObject, [
                    'name'
                ]);
                if (fromName != null) setValueByPath(toObject, [
                    'name'
                ], fromName);
                const fromParameters = getValueByPath(fromObject, [
                    'parameters'
                ]);
                if (fromParameters != null) setValueByPath(toObject, [
                    'parameters'
                ], fromParameters);
                const fromParametersJsonSchema = getValueByPath(fromObject, [
                    'parametersJsonSchema'
                ]);
                if (fromParametersJsonSchema != null) setValueByPath(toObject, [
                    'parametersJsonSchema'
                ], fromParametersJsonSchema);
                const fromResponse = getValueByPath(fromObject, [
                    'response'
                ]);
                if (fromResponse != null) setValueByPath(toObject, [
                    'response'
                ], fromResponse);
                const fromResponseJsonSchema = getValueByPath(fromObject, [
                    'responseJsonSchema'
                ]);
                if (fromResponseJsonSchema != null) setValueByPath(toObject, [
                    'responseJsonSchema'
                ], fromResponseJsonSchema);
                return toObject;
            }
            function getCachedContentParametersToMldev(apiClient, fromObject) {
                const toObject = {};
                const fromName = getValueByPath(fromObject, [
                    'name'
                ]);
                if (fromName != null) setValueByPath(toObject, [
                    '_url',
                    'name'
                ], tCachedContentName(apiClient, fromName));
                return toObject;
            }
            function getCachedContentParametersToVertex(apiClient, fromObject) {
                const toObject = {};
                const fromName = getValueByPath(fromObject, [
                    'name'
                ]);
                if (fromName != null) setValueByPath(toObject, [
                    '_url',
                    'name'
                ], tCachedContentName(apiClient, fromName));
                return toObject;
            }
            function googleMapsToMldev$3(fromObject) {
                const toObject = {};
                if (getValueByPath(fromObject, [
                    'authConfig'
                ]) !== undefined) throw new Error('authConfig parameter is not supported in Gemini API.');
                const fromEnableWidget = getValueByPath(fromObject, [
                    'enableWidget'
                ]);
                if (fromEnableWidget != null) setValueByPath(toObject, [
                    'enableWidget'
                ], fromEnableWidget);
                return toObject;
            }
            function googleSearchToMldev$3(fromObject) {
                const toObject = {};
                if (getValueByPath(fromObject, [
                    'excludeDomains'
                ]) !== undefined) throw new Error('excludeDomains parameter is not supported in Gemini API.');
                if (getValueByPath(fromObject, [
                    'blockingConfidence'
                ]) !== undefined) throw new Error('blockingConfidence parameter is not supported in Gemini API.');
                const fromTimeRangeFilter = getValueByPath(fromObject, [
                    'timeRangeFilter'
                ]);
                if (fromTimeRangeFilter != null) setValueByPath(toObject, [
                    'timeRangeFilter'
                ], fromTimeRangeFilter);
                return toObject;
            }
            function listCachedContentsConfigToMldev(fromObject, parentObject) {
                const toObject = {};
                const fromPageSize = getValueByPath(fromObject, [
                    'pageSize'
                ]);
                if (parentObject !== undefined && fromPageSize != null) setValueByPath(parentObject, [
                    '_query',
                    'pageSize'
                ], fromPageSize);
                const fromPageToken = getValueByPath(fromObject, [
                    'pageToken'
                ]);
                if (parentObject !== undefined && fromPageToken != null) setValueByPath(parentObject, [
                    '_query',
                    'pageToken'
                ], fromPageToken);
                return toObject;
            }
            function listCachedContentsConfigToVertex(fromObject, parentObject) {
                const toObject = {};
                const fromPageSize = getValueByPath(fromObject, [
                    'pageSize'
                ]);
                if (parentObject !== undefined && fromPageSize != null) setValueByPath(parentObject, [
                    '_query',
                    'pageSize'
                ], fromPageSize);
                const fromPageToken = getValueByPath(fromObject, [
                    'pageToken'
                ]);
                if (parentObject !== undefined && fromPageToken != null) setValueByPath(parentObject, [
                    '_query',
                    'pageToken'
                ], fromPageToken);
                return toObject;
            }
            function listCachedContentsParametersToMldev(fromObject) {
                const toObject = {};
                const fromConfig = getValueByPath(fromObject, [
                    'config'
                ]);
                if (fromConfig != null) listCachedContentsConfigToMldev(fromConfig, toObject);
                return toObject;
            }
            function listCachedContentsParametersToVertex(fromObject) {
                const toObject = {};
                const fromConfig = getValueByPath(fromObject, [
                    'config'
                ]);
                if (fromConfig != null) listCachedContentsConfigToVertex(fromConfig, toObject);
                return toObject;
            }
            function listCachedContentsResponseFromMldev(fromObject) {
                const toObject = {};
                const fromSdkHttpResponse = getValueByPath(fromObject, [
                    'sdkHttpResponse'
                ]);
                if (fromSdkHttpResponse != null) setValueByPath(toObject, [
                    'sdkHttpResponse'
                ], fromSdkHttpResponse);
                const fromNextPageToken = getValueByPath(fromObject, [
                    'nextPageToken'
                ]);
                if (fromNextPageToken != null) setValueByPath(toObject, [
                    'nextPageToken'
                ], fromNextPageToken);
                const fromCachedContents = getValueByPath(fromObject, [
                    'cachedContents'
                ]);
                if (fromCachedContents != null) {
                    let transformedList = fromCachedContents;
                    if (Array.isArray(transformedList)) transformedList = transformedList.map((item)=>{
                        return item;
                    });
                    setValueByPath(toObject, [
                        'cachedContents'
                    ], transformedList);
                }
                return toObject;
            }
            function listCachedContentsResponseFromVertex(fromObject) {
                const toObject = {};
                const fromSdkHttpResponse = getValueByPath(fromObject, [
                    'sdkHttpResponse'
                ]);
                if (fromSdkHttpResponse != null) setValueByPath(toObject, [
                    'sdkHttpResponse'
                ], fromSdkHttpResponse);
                const fromNextPageToken = getValueByPath(fromObject, [
                    'nextPageToken'
                ]);
                if (fromNextPageToken != null) setValueByPath(toObject, [
                    'nextPageToken'
                ], fromNextPageToken);
                const fromCachedContents = getValueByPath(fromObject, [
                    'cachedContents'
                ]);
                if (fromCachedContents != null) {
                    let transformedList = fromCachedContents;
                    if (Array.isArray(transformedList)) transformedList = transformedList.map((item)=>{
                        return item;
                    });
                    setValueByPath(toObject, [
                        'cachedContents'
                    ], transformedList);
                }
                return toObject;
            }
            function partToMldev$3(fromObject) {
                const toObject = {};
                const fromMediaResolution = getValueByPath(fromObject, [
                    'mediaResolution'
                ]);
                if (fromMediaResolution != null) setValueByPath(toObject, [
                    'mediaResolution'
                ], fromMediaResolution);
                const fromCodeExecutionResult = getValueByPath(fromObject, [
                    'codeExecutionResult'
                ]);
                if (fromCodeExecutionResult != null) setValueByPath(toObject, [
                    'codeExecutionResult'
                ], fromCodeExecutionResult);
                const fromExecutableCode = getValueByPath(fromObject, [
                    'executableCode'
                ]);
                if (fromExecutableCode != null) setValueByPath(toObject, [
                    'executableCode'
                ], fromExecutableCode);
                const fromFileData = getValueByPath(fromObject, [
                    'fileData'
                ]);
                if (fromFileData != null) setValueByPath(toObject, [
                    'fileData'
                ], fileDataToMldev$3(fromFileData));
                const fromFunctionCall = getValueByPath(fromObject, [
                    'functionCall'
                ]);
                if (fromFunctionCall != null) setValueByPath(toObject, [
                    'functionCall'
                ], functionCallToMldev$3(fromFunctionCall));
                const fromFunctionResponse = getValueByPath(fromObject, [
                    'functionResponse'
                ]);
                if (fromFunctionResponse != null) setValueByPath(toObject, [
                    'functionResponse'
                ], fromFunctionResponse);
                const fromInlineData = getValueByPath(fromObject, [
                    'inlineData'
                ]);
                if (fromInlineData != null) setValueByPath(toObject, [
                    'inlineData'
                ], blobToMldev$3(fromInlineData));
                const fromText = getValueByPath(fromObject, [
                    'text'
                ]);
                if (fromText != null) setValueByPath(toObject, [
                    'text'
                ], fromText);
                const fromThought = getValueByPath(fromObject, [
                    'thought'
                ]);
                if (fromThought != null) setValueByPath(toObject, [
                    'thought'
                ], fromThought);
                const fromThoughtSignature = getValueByPath(fromObject, [
                    'thoughtSignature'
                ]);
                if (fromThoughtSignature != null) setValueByPath(toObject, [
                    'thoughtSignature'
                ], fromThoughtSignature);
                const fromVideoMetadata = getValueByPath(fromObject, [
                    'videoMetadata'
                ]);
                if (fromVideoMetadata != null) setValueByPath(toObject, [
                    'videoMetadata'
                ], fromVideoMetadata);
                return toObject;
            }
            function toolConfigToMldev$1(fromObject) {
                const toObject = {};
                const fromFunctionCallingConfig = getValueByPath(fromObject, [
                    'functionCallingConfig'
                ]);
                if (fromFunctionCallingConfig != null) setValueByPath(toObject, [
                    'functionCallingConfig'
                ], functionCallingConfigToMldev$1(fromFunctionCallingConfig));
                const fromRetrievalConfig = getValueByPath(fromObject, [
                    'retrievalConfig'
                ]);
                if (fromRetrievalConfig != null) setValueByPath(toObject, [
                    'retrievalConfig'
                ], fromRetrievalConfig);
                return toObject;
            }
            function toolToMldev$3(fromObject) {
                const toObject = {};
                const fromFunctionDeclarations = getValueByPath(fromObject, [
                    'functionDeclarations'
                ]);
                if (fromFunctionDeclarations != null) {
                    let transformedList = fromFunctionDeclarations;
                    if (Array.isArray(transformedList)) transformedList = transformedList.map((item)=>{
                        return item;
                    });
                    setValueByPath(toObject, [
                        'functionDeclarations'
                    ], transformedList);
                }
                if (getValueByPath(fromObject, [
                    'retrieval'
                ]) !== undefined) throw new Error('retrieval parameter is not supported in Gemini API.');
                const fromGoogleSearchRetrieval = getValueByPath(fromObject, [
                    'googleSearchRetrieval'
                ]);
                if (fromGoogleSearchRetrieval != null) setValueByPath(toObject, [
                    'googleSearchRetrieval'
                ], fromGoogleSearchRetrieval);
                const fromComputerUse = getValueByPath(fromObject, [
                    'computerUse'
                ]);
                if (fromComputerUse != null) setValueByPath(toObject, [
                    'computerUse'
                ], fromComputerUse);
                const fromFileSearch = getValueByPath(fromObject, [
                    'fileSearch'
                ]);
                if (fromFileSearch != null) setValueByPath(toObject, [
                    'fileSearch'
                ], fromFileSearch);
                const fromCodeExecution = getValueByPath(fromObject, [
                    'codeExecution'
                ]);
                if (fromCodeExecution != null) setValueByPath(toObject, [
                    'codeExecution'
                ], fromCodeExecution);
                if (getValueByPath(fromObject, [
                    'enterpriseWebSearch'
                ]) !== undefined) throw new Error('enterpriseWebSearch parameter is not supported in Gemini API.');
                const fromGoogleMaps = getValueByPath(fromObject, [
                    'googleMaps'
                ]);
                if (fromGoogleMaps != null) setValueByPath(toObject, [
                    'googleMaps'
                ], googleMapsToMldev$3(fromGoogleMaps));
                const fromGoogleSearch = getValueByPath(fromObject, [
                    'googleSearch'
                ]);
                if (fromGoogleSearch != null) setValueByPath(toObject, [
                    'googleSearch'
                ], googleSearchToMldev$3(fromGoogleSearch));
                const fromUrlContext = getValueByPath(fromObject, [
                    'urlContext'
                ]);
                if (fromUrlContext != null) setValueByPath(toObject, [
                    'urlContext'
                ], fromUrlContext);
                return toObject;
            }
            function toolToVertex$2(fromObject) {
                const toObject = {};
                const fromFunctionDeclarations = getValueByPath(fromObject, [
                    'functionDeclarations'
                ]);
                if (fromFunctionDeclarations != null) {
                    let transformedList = fromFunctionDeclarations;
                    if (Array.isArray(transformedList)) transformedList = transformedList.map((item)=>{
                        return functionDeclarationToVertex$2(item);
                    });
                    setValueByPath(toObject, [
                        'functionDeclarations'
                    ], transformedList);
                }
                const fromRetrieval = getValueByPath(fromObject, [
                    'retrieval'
                ]);
                if (fromRetrieval != null) setValueByPath(toObject, [
                    'retrieval'
                ], fromRetrieval);
                const fromGoogleSearchRetrieval = getValueByPath(fromObject, [
                    'googleSearchRetrieval'
                ]);
                if (fromGoogleSearchRetrieval != null) setValueByPath(toObject, [
                    'googleSearchRetrieval'
                ], fromGoogleSearchRetrieval);
                const fromComputerUse = getValueByPath(fromObject, [
                    'computerUse'
                ]);
                if (fromComputerUse != null) setValueByPath(toObject, [
                    'computerUse'
                ], fromComputerUse);
                if (getValueByPath(fromObject, [
                    'fileSearch'
                ]) !== undefined) throw new Error('fileSearch parameter is not supported in Vertex AI.');
                const fromCodeExecution = getValueByPath(fromObject, [
                    'codeExecution'
                ]);
                if (fromCodeExecution != null) setValueByPath(toObject, [
                    'codeExecution'
                ], fromCodeExecution);
                const fromEnterpriseWebSearch = getValueByPath(fromObject, [
                    'enterpriseWebSearch'
                ]);
                if (fromEnterpriseWebSearch != null) setValueByPath(toObject, [
                    'enterpriseWebSearch'
                ], fromEnterpriseWebSearch);
                const fromGoogleMaps = getValueByPath(fromObject, [
                    'googleMaps'
                ]);
                if (fromGoogleMaps != null) setValueByPath(toObject, [
                    'googleMaps'
                ], fromGoogleMaps);
                const fromGoogleSearch = getValueByPath(fromObject, [
                    'googleSearch'
                ]);
                if (fromGoogleSearch != null) setValueByPath(toObject, [
                    'googleSearch'
                ], fromGoogleSearch);
                const fromUrlContext = getValueByPath(fromObject, [
                    'urlContext'
                ]);
                if (fromUrlContext != null) setValueByPath(toObject, [
                    'urlContext'
                ], fromUrlContext);
                return toObject;
            }
            function updateCachedContentConfigToMldev(fromObject, parentObject) {
                const toObject = {};
                const fromTtl = getValueByPath(fromObject, [
                    'ttl'
                ]);
                if (parentObject !== undefined && fromTtl != null) setValueByPath(parentObject, [
                    'ttl'
                ], fromTtl);
                const fromExpireTime = getValueByPath(fromObject, [
                    'expireTime'
                ]);
                if (parentObject !== undefined && fromExpireTime != null) setValueByPath(parentObject, [
                    'expireTime'
                ], fromExpireTime);
                return toObject;
            }
            function updateCachedContentConfigToVertex(fromObject, parentObject) {
                const toObject = {};
                const fromTtl = getValueByPath(fromObject, [
                    'ttl'
                ]);
                if (parentObject !== undefined && fromTtl != null) setValueByPath(parentObject, [
                    'ttl'
                ], fromTtl);
                const fromExpireTime = getValueByPath(fromObject, [
                    'expireTime'
                ]);
                if (parentObject !== undefined && fromExpireTime != null) setValueByPath(parentObject, [
                    'expireTime'
                ], fromExpireTime);
                return toObject;
            }
            function updateCachedContentParametersToMldev(apiClient, fromObject) {
                const toObject = {};
                const fromName = getValueByPath(fromObject, [
                    'name'
                ]);
                if (fromName != null) setValueByPath(toObject, [
                    '_url',
                    'name'
                ], tCachedContentName(apiClient, fromName));
                const fromConfig = getValueByPath(fromObject, [
                    'config'
                ]);
                if (fromConfig != null) updateCachedContentConfigToMldev(fromConfig, toObject);
                return toObject;
            }
            function updateCachedContentParametersToVertex(apiClient, fromObject) {
                const toObject = {};
                const fromName = getValueByPath(fromObject, [
                    'name'
                ]);
                if (fromName != null) setValueByPath(toObject, [
                    '_url',
                    'name'
                ], tCachedContentName(apiClient, fromName));
                const fromConfig = getValueByPath(fromObject, [
                    'config'
                ]);
                if (fromConfig != null) updateCachedContentConfigToVertex(fromConfig, toObject);
                return toObject;
            }
            class Caches extends BaseModule {
                constructor(apiClient){
                    super();
                    this.apiClient = apiClient;
                    this.list = async (params = {})=>{
                        return new Pager(PagedItem.PAGED_ITEM_CACHED_CONTENTS, (x)=>this.listInternal(x), await this.listInternal(params), params);
                    };
                }
                async create(params) {
                    var _a, _b, _c, _d;
                    let response;
                    let path = '';
                    let queryParams = {};
                    if (this.apiClient.isVertexAI()) {
                        const body = createCachedContentParametersToVertex(this.apiClient, params);
                        path = formatMap('cachedContents', body['_url']);
                        queryParams = body['_query'];
                        delete body['_url'];
                        delete body['_query'];
                        response = this.apiClient.request({
                            path: path,
                            queryParams: queryParams,
                            body: JSON.stringify(body),
                            httpMethod: 'POST',
                            httpOptions: (_a = params.config) === null || _a === void 0 ? void 0 : _a.httpOptions,
                            abortSignal: (_b = params.config) === null || _b === void 0 ? void 0 : _b.abortSignal
                        }).then((httpResponse)=>{
                            return httpResponse.json();
                        });
                        return response.then((resp)=>{
                            return resp;
                        });
                    } else {
                        const body = createCachedContentParametersToMldev(this.apiClient, params);
                        path = formatMap('cachedContents', body['_url']);
                        queryParams = body['_query'];
                        delete body['_url'];
                        delete body['_query'];
                        response = this.apiClient.request({
                            path: path,
                            queryParams: queryParams,
                            body: JSON.stringify(body),
                            httpMethod: 'POST',
                            httpOptions: (_c = params.config) === null || _c === void 0 ? void 0 : _c.httpOptions,
                            abortSignal: (_d = params.config) === null || _d === void 0 ? void 0 : _d.abortSignal
                        }).then((httpResponse)=>{
                            return httpResponse.json();
                        });
                        return response.then((resp)=>{
                            return resp;
                        });
                    }
                }
                async get(params) {
                    var _a, _b, _c, _d;
                    let response;
                    let path = '';
                    let queryParams = {};
                    if (this.apiClient.isVertexAI()) {
                        const body = getCachedContentParametersToVertex(this.apiClient, params);
                        path = formatMap('{name}', body['_url']);
                        queryParams = body['_query'];
                        delete body['_url'];
                        delete body['_query'];
                        response = this.apiClient.request({
                            path: path,
                            queryParams: queryParams,
                            body: JSON.stringify(body),
                            httpMethod: 'GET',
                            httpOptions: (_a = params.config) === null || _a === void 0 ? void 0 : _a.httpOptions,
                            abortSignal: (_b = params.config) === null || _b === void 0 ? void 0 : _b.abortSignal
                        }).then((httpResponse)=>{
                            return httpResponse.json();
                        });
                        return response.then((resp)=>{
                            return resp;
                        });
                    } else {
                        const body = getCachedContentParametersToMldev(this.apiClient, params);
                        path = formatMap('{name}', body['_url']);
                        queryParams = body['_query'];
                        delete body['_url'];
                        delete body['_query'];
                        response = this.apiClient.request({
                            path: path,
                            queryParams: queryParams,
                            body: JSON.stringify(body),
                            httpMethod: 'GET',
                            httpOptions: (_c = params.config) === null || _c === void 0 ? void 0 : _c.httpOptions,
                            abortSignal: (_d = params.config) === null || _d === void 0 ? void 0 : _d.abortSignal
                        }).then((httpResponse)=>{
                            return httpResponse.json();
                        });
                        return response.then((resp)=>{
                            return resp;
                        });
                    }
                }
                async delete(params) {
                    var _a, _b, _c, _d;
                    let response;
                    let path = '';
                    let queryParams = {};
                    if (this.apiClient.isVertexAI()) {
                        const body = deleteCachedContentParametersToVertex(this.apiClient, params);
                        path = formatMap('{name}', body['_url']);
                        queryParams = body['_query'];
                        delete body['_url'];
                        delete body['_query'];
                        response = this.apiClient.request({
                            path: path,
                            queryParams: queryParams,
                            body: JSON.stringify(body),
                            httpMethod: 'DELETE',
                            httpOptions: (_a = params.config) === null || _a === void 0 ? void 0 : _a.httpOptions,
                            abortSignal: (_b = params.config) === null || _b === void 0 ? void 0 : _b.abortSignal
                        }).then((httpResponse)=>{
                            return httpResponse.json().then((jsonResponse)=>{
                                const response = jsonResponse;
                                response.sdkHttpResponse = {
                                    headers: httpResponse.headers
                                };
                                return response;
                            });
                        });
                        return response.then((apiResponse)=>{
                            const resp = deleteCachedContentResponseFromVertex(apiResponse);
                            const typedResp = new DeleteCachedContentResponse();
                            Object.assign(typedResp, resp);
                            return typedResp;
                        });
                    } else {
                        const body = deleteCachedContentParametersToMldev(this.apiClient, params);
                        path = formatMap('{name}', body['_url']);
                        queryParams = body['_query'];
                        delete body['_url'];
                        delete body['_query'];
                        response = this.apiClient.request({
                            path: path,
                            queryParams: queryParams,
                            body: JSON.stringify(body),
                            httpMethod: 'DELETE',
                            httpOptions: (_c = params.config) === null || _c === void 0 ? void 0 : _c.httpOptions,
                            abortSignal: (_d = params.config) === null || _d === void 0 ? void 0 : _d.abortSignal
                        }).then((httpResponse)=>{
                            return httpResponse.json().then((jsonResponse)=>{
                                const response = jsonResponse;
                                response.sdkHttpResponse = {
                                    headers: httpResponse.headers
                                };
                                return response;
                            });
                        });
                        return response.then((apiResponse)=>{
                            const resp = deleteCachedContentResponseFromMldev(apiResponse);
                            const typedResp = new DeleteCachedContentResponse();
                            Object.assign(typedResp, resp);
                            return typedResp;
                        });
                    }
                }
                async update(params) {
                    var _a, _b, _c, _d;
                    let response;
                    let path = '';
                    let queryParams = {};
                    if (this.apiClient.isVertexAI()) {
                        const body = updateCachedContentParametersToVertex(this.apiClient, params);
                        path = formatMap('{name}', body['_url']);
                        queryParams = body['_query'];
                        delete body['_url'];
                        delete body['_query'];
                        response = this.apiClient.request({
                            path: path,
                            queryParams: queryParams,
                            body: JSON.stringify(body),
                            httpMethod: 'PATCH',
                            httpOptions: (_a = params.config) === null || _a === void 0 ? void 0 : _a.httpOptions,
                            abortSignal: (_b = params.config) === null || _b === void 0 ? void 0 : _b.abortSignal
                        }).then((httpResponse)=>{
                            return httpResponse.json();
                        });
                        return response.then((resp)=>{
                            return resp;
                        });
                    } else {
                        const body = updateCachedContentParametersToMldev(this.apiClient, params);
                        path = formatMap('{name}', body['_url']);
                        queryParams = body['_query'];
                        delete body['_url'];
                        delete body['_query'];
                        response = this.apiClient.request({
                            path: path,
                            queryParams: queryParams,
                            body: JSON.stringify(body),
                            httpMethod: 'PATCH',
                            httpOptions: (_c = params.config) === null || _c === void 0 ? void 0 : _c.httpOptions,
                            abortSignal: (_d = params.config) === null || _d === void 0 ? void 0 : _d.abortSignal
                        }).then((httpResponse)=>{
                            return httpResponse.json();
                        });
                        return response.then((resp)=>{
                            return resp;
                        });
                    }
                }
                async listInternal(params) {
                    var _a, _b, _c, _d;
                    let response;
                    let path = '';
                    let queryParams = {};
                    if (this.apiClient.isVertexAI()) {
                        const body = listCachedContentsParametersToVertex(params);
                        path = formatMap('cachedContents', body['_url']);
                        queryParams = body['_query'];
                        delete body['_url'];
                        delete body['_query'];
                        response = this.apiClient.request({
                            path: path,
                            queryParams: queryParams,
                            body: JSON.stringify(body),
                            httpMethod: 'GET',
                            httpOptions: (_a = params.config) === null || _a === void 0 ? void 0 : _a.httpOptions,
                            abortSignal: (_b = params.config) === null || _b === void 0 ? void 0 : _b.abortSignal
                        }).then((httpResponse)=>{
                            return httpResponse.json().then((jsonResponse)=>{
                                const response = jsonResponse;
                                response.sdkHttpResponse = {
                                    headers: httpResponse.headers
                                };
                                return response;
                            });
                        });
                        return response.then((apiResponse)=>{
                            const resp = listCachedContentsResponseFromVertex(apiResponse);
                            const typedResp = new ListCachedContentsResponse();
                            Object.assign(typedResp, resp);
                            return typedResp;
                        });
                    } else {
                        const body = listCachedContentsParametersToMldev(params);
                        path = formatMap('cachedContents', body['_url']);
                        queryParams = body['_query'];
                        delete body['_url'];
                        delete body['_query'];
                        response = this.apiClient.request({
                            path: path,
                            queryParams: queryParams,
                            body: JSON.stringify(body),
                            httpMethod: 'GET',
                            httpOptions: (_c = params.config) === null || _c === void 0 ? void 0 : _c.httpOptions,
                            abortSignal: (_d = params.config) === null || _d === void 0 ? void 0 : _d.abortSignal
                        }).then((httpResponse)=>{
                            return httpResponse.json().then((jsonResponse)=>{
                                const response = jsonResponse;
                                response.sdkHttpResponse = {
                                    headers: httpResponse.headers
                                };
                                return response;
                            });
                        });
                        return response.then((apiResponse)=>{
                            const resp = listCachedContentsResponseFromMldev(apiResponse);
                            const typedResp = new ListCachedContentsResponse();
                            Object.assign(typedResp, resp);
                            return typedResp;
                        });
                    }
                }
            }
            function __rest(s, e) {
                var t = {};
                for(var p in s)if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
                if (s != null && typeof Object.getOwnPropertySymbols === "function") {
                    for(var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++)if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
                }
                return t;
            }
            function __values(o) {
                var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
                if (m) return m.call(o);
                if (o && typeof o.length === "number") return {
                    next: function() {
                        if (o && i >= o.length) o = void 0;
                        return {
                            value: o && o[i++],
                            done: !o
                        };
                    }
                };
                throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
            }
            function __await(v) {
                return this instanceof __await ? (this.v = v, this) : new __await(v);
            }
            function __asyncGenerator(thisArg, _arguments, generator) {
                if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
                var g = generator.apply(thisArg, _arguments || []), i, q = [];
                return i = Object.create((typeof AsyncIterator === "function" ? AsyncIterator : Object).prototype), verb("next"), verb("throw"), verb("return", awaitReturn), i[Symbol.asyncIterator] = function() {
                    return this;
                }, i;
                function awaitReturn(f) {
                    return function(v) {
                        return Promise.resolve(v).then(f, reject);
                    };
                }
                function verb(n, f) {
                    if (g[n]) {
                        i[n] = function(v) {
                            return new Promise(function(a, b) {
                                q.push([
                                    n,
                                    v,
                                    a,
                                    b
                                ]) > 1 || resume(n, v);
                            });
                        };
                        if (f) i[n] = f(i[n]);
                    }
                }
                function resume(n, v) {
                    try {
                        step(g[n](v));
                    } catch (e) {
                        settle(q[0][3], e);
                    }
                }
                function step(r) {
                    r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);
                }
                function fulfill(value) {
                    resume("next", value);
                }
                function reject(value) {
                    resume("throw", value);
                }
                function settle(f, v) {
                    if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]);
                }
            }
            function __asyncValues(o) {
                if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
                var m = o[Symbol.asyncIterator], i;
                return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
                    return this;
                }, i);
                function verb(n) {
                    i[n] = o[n] && function(v) {
                        return new Promise(function(resolve, reject) {
                            v = o[n](v), settle(resolve, reject, v.done, v.value);
                        });
                    };
                }
                function settle(resolve, reject, d, v) {
                    Promise.resolve(v).then(function(v) {
                        resolve({
                            value: v,
                            done: d
                        });
                    }, reject);
                }
            }
            typeof SuppressedError === "function" && SuppressedError;
            function isValidResponse(response) {
                var _a;
                if (response.candidates == undefined || response.candidates.length === 0) return false;
                const content = (_a = response.candidates[0]) === null || _a === void 0 ? void 0 : _a.content;
                if (content === undefined) return false;
                return isValidContent(content);
            }
            function isValidContent(content) {
                if (content.parts === undefined || content.parts.length === 0) return false;
                for (const part of content.parts){
                    if (part === undefined || Object.keys(part).length === 0) return false;
                }
                return true;
            }
            function validateHistory(history) {
                if (history.length === 0) return;
                for (const content of history){
                    if (content.role !== 'user' && content.role !== 'model') throw new Error(`Role must be user or model, but got ${content.role}.`);
                }
            }
            function extractCuratedHistory(comprehensiveHistory) {
                if (comprehensiveHistory === undefined || comprehensiveHistory.length === 0) return [];
                const curatedHistory = [];
                const length = comprehensiveHistory.length;
                let i = 0;
                while(i < length)if (comprehensiveHistory[i].role === 'user') {
                    curatedHistory.push(comprehensiveHistory[i]);
                    i++;
                } else {
                    const modelOutput = [];
                    let isValid = true;
                    while(i < length && comprehensiveHistory[i].role === 'model'){
                        modelOutput.push(comprehensiveHistory[i]);
                        if (isValid && !isValidContent(comprehensiveHistory[i])) isValid = false;
                        i++;
                    }
                    if (isValid) curatedHistory.push(...modelOutput);
                    else curatedHistory.pop();
                }
                return curatedHistory;
            }
            class Chats {
                constructor(modelsModule, apiClient){
                    this.modelsModule = modelsModule;
                    this.apiClient = apiClient;
                }
                create(params) {
                    return new Chat(this.apiClient, this.modelsModule, params.model, params.config, structuredClone(params.history));
                }
            }
            class Chat {
                constructor(apiClient, modelsModule, model, config = {}, history = []){
                    this.apiClient = apiClient;
                    this.modelsModule = modelsModule;
                    this.model = model;
                    this.config = config;
                    this.history = history;
                    this.sendPromise = Promise.resolve();
                    validateHistory(history);
                }
                async sendMessage(params) {
                    var _a;
                    await this.sendPromise;
                    const inputContent = tContent(params.message);
                    const responsePromise = this.modelsModule.generateContent({
                        model: this.model,
                        contents: this.getHistory(true).concat(inputContent),
                        config: (_a = params.config) !== null && _a !== void 0 ? _a : this.config
                    });
                    this.sendPromise = (async ()=>{
                        var _a, _b, _c;
                        const response = await responsePromise;
                        const outputContent = (_b = (_a = response.candidates) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.content;
                        const fullAutomaticFunctionCallingHistory = response.automaticFunctionCallingHistory;
                        const index = this.getHistory(true).length;
                        let automaticFunctionCallingHistory = [];
                        if (fullAutomaticFunctionCallingHistory != null) automaticFunctionCallingHistory = (_c = fullAutomaticFunctionCallingHistory.slice(index)) !== null && _c !== void 0 ? _c : [];
                        const modelOutput = outputContent ? [
                            outputContent
                        ] : [];
                        this.recordHistory(inputContent, modelOutput, automaticFunctionCallingHistory);
                        return;
                    })();
                    await this.sendPromise.catch(()=>{
                        this.sendPromise = Promise.resolve();
                    });
                    return responsePromise;
                }
                async sendMessageStream(params) {
                    var _a;
                    await this.sendPromise;
                    const inputContent = tContent(params.message);
                    const streamResponse = this.modelsModule.generateContentStream({
                        model: this.model,
                        contents: this.getHistory(true).concat(inputContent),
                        config: (_a = params.config) !== null && _a !== void 0 ? _a : this.config
                    });
                    this.sendPromise = streamResponse.then(()=>undefined).catch(()=>undefined);
                    const response = await streamResponse;
                    const result = this.processStreamResponse(response, inputContent);
                    return result;
                }
                getHistory(curated = false) {
                    const history = curated ? extractCuratedHistory(this.history) : this.history;
                    return structuredClone(history);
                }
                processStreamResponse(streamResponse, inputContent) {
                    return __asyncGenerator(this, arguments, function* processStreamResponse_1() {
                        var _a, e_1, _b, _c;
                        var _d, _e;
                        const outputContent = [];
                        try {
                            for(var _f = true, streamResponse_1 = __asyncValues(streamResponse), streamResponse_1_1; streamResponse_1_1 = yield __await(streamResponse_1.next()), _a = streamResponse_1_1.done, !_a; _f = true){
                                _c = streamResponse_1_1.value;
                                _f = false;
                                const chunk = _c;
                                if (isValidResponse(chunk)) {
                                    const content = (_e = (_d = chunk.candidates) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.content;
                                    if (content !== undefined) outputContent.push(content);
                                }
                                yield yield __await(chunk);
                            }
                        } catch (e_1_1) {
                            e_1 = {
                                error: e_1_1
                            };
                        } finally{
                            try {
                                if (!_f && !_a && (_b = streamResponse_1.return)) yield __await(_b.call(streamResponse_1));
                            } finally{
                                if (e_1) throw e_1.error;
                            }
                        }
                        this.recordHistory(inputContent, outputContent);
                    });
                }
                recordHistory(userInput, modelOutput, automaticFunctionCallingHistory) {
                    let outputContents = [];
                    if (modelOutput.length > 0 && modelOutput.every((content)=>content.role !== undefined)) outputContents = modelOutput;
                    else outputContents.push({
                        role: 'model',
                        parts: []
                    });
                    if (automaticFunctionCallingHistory && automaticFunctionCallingHistory.length > 0) this.history.push(...extractCuratedHistory(automaticFunctionCallingHistory));
                    else this.history.push(userInput);
                    this.history.push(...outputContents);
                }
            }
            class ApiError extends Error {
                constructor(options){
                    super(options.message);
                    this.name = 'ApiError';
                    this.status = options.status;
                    Object.setPrototypeOf(this, ApiError.prototype);
                }
            }
            function createFileParametersToMldev(fromObject) {
                const toObject = {};
                const fromFile = getValueByPath(fromObject, [
                    'file'
                ]);
                if (fromFile != null) setValueByPath(toObject, [
                    'file'
                ], fromFile);
                return toObject;
            }
            function createFileResponseFromMldev(fromObject) {
                const toObject = {};
                const fromSdkHttpResponse = getValueByPath(fromObject, [
                    'sdkHttpResponse'
                ]);
                if (fromSdkHttpResponse != null) setValueByPath(toObject, [
                    'sdkHttpResponse'
                ], fromSdkHttpResponse);
                return toObject;
            }
            function deleteFileParametersToMldev(fromObject) {
                const toObject = {};
                const fromName = getValueByPath(fromObject, [
                    'name'
                ]);
                if (fromName != null) setValueByPath(toObject, [
                    '_url',
                    'file'
                ], tFileName(fromName));
                return toObject;
            }
            function deleteFileResponseFromMldev(fromObject) {
                const toObject = {};
                const fromSdkHttpResponse = getValueByPath(fromObject, [
                    'sdkHttpResponse'
                ]);
                if (fromSdkHttpResponse != null) setValueByPath(toObject, [
                    'sdkHttpResponse'
                ], fromSdkHttpResponse);
                return toObject;
            }
            function getFileParametersToMldev(fromObject) {
                const toObject = {};
                const fromName = getValueByPath(fromObject, [
                    'name'
                ]);
                if (fromName != null) setValueByPath(toObject, [
                    '_url',
                    'file'
                ], tFileName(fromName));
                return toObject;
            }
            function listFilesConfigToMldev(fromObject, parentObject) {
                const toObject = {};
                const fromPageSize = getValueByPath(fromObject, [
                    'pageSize'
                ]);
                if (parentObject !== undefined && fromPageSize != null) setValueByPath(parentObject, [
                    '_query',
                    'pageSize'
                ], fromPageSize);
                const fromPageToken = getValueByPath(fromObject, [
                    'pageToken'
                ]);
                if (parentObject !== undefined && fromPageToken != null) setValueByPath(parentObject, [
                    '_query',
                    'pageToken'
                ], fromPageToken);
                return toObject;
            }
            function listFilesParametersToMldev(fromObject) {
                const toObject = {};
                const fromConfig = getValueByPath(fromObject, [
                    'config'
                ]);
                if (fromConfig != null) listFilesConfigToMldev(fromConfig, toObject);
                return toObject;
            }
            function listFilesResponseFromMldev(fromObject) {
                const toObject = {};
                const fromSdkHttpResponse = getValueByPath(fromObject, [
                    'sdkHttpResponse'
                ]);
                if (fromSdkHttpResponse != null) setValueByPath(toObject, [
                    'sdkHttpResponse'
                ], fromSdkHttpResponse);
                const fromNextPageToken = getValueByPath(fromObject, [
                    'nextPageToken'
                ]);
                if (fromNextPageToken != null) setValueByPath(toObject, [
                    'nextPageToken'
                ], fromNextPageToken);
                const fromFiles = getValueByPath(fromObject, [
                    'files'
                ]);
                if (fromFiles != null) {
                    let transformedList = fromFiles;
                    if (Array.isArray(transformedList)) transformedList = transformedList.map((item)=>{
                        return item;
                    });
                    setValueByPath(toObject, [
                        'files'
                    ], transformedList);
                }
                return toObject;
            }
            class Files extends BaseModule {
                constructor(apiClient){
                    super();
                    this.apiClient = apiClient;
                    this.list = async (params = {})=>{
                        return new Pager(PagedItem.PAGED_ITEM_FILES, (x)=>this.listInternal(x), await this.listInternal(params), params);
                    };
                }
                async upload(params) {
                    if (this.apiClient.isVertexAI()) throw new Error('Vertex AI does not support uploading files. You can share files through a GCS bucket.');
                    return this.apiClient.uploadFile(params.file, params.config).then((resp)=>{
                        return resp;
                    });
                }
                async download(params) {
                    await this.apiClient.downloadFile(params);
                }
                async listInternal(params) {
                    var _a, _b;
                    let response;
                    let path = '';
                    let queryParams = {};
                    if (this.apiClient.isVertexAI()) throw new Error('This method is only supported by the Gemini Developer API.');
                    else {
                        const body = listFilesParametersToMldev(params);
                        path = formatMap('files', body['_url']);
                        queryParams = body['_query'];
                        delete body['_url'];
                        delete body['_query'];
                        response = this.apiClient.request({
                            path: path,
                            queryParams: queryParams,
                            body: JSON.stringify(body),
                            httpMethod: 'GET',
                            httpOptions: (_a = params.config) === null || _a === void 0 ? void 0 : _a.httpOptions,
                            abortSignal: (_b = params.config) === null || _b === void 0 ? void 0 : _b.abortSignal
                        }).then((httpResponse)=>{
                            return httpResponse.json().then((jsonResponse)=>{
                                const response = jsonResponse;
                                response.sdkHttpResponse = {
                                    headers: httpResponse.headers
                                };
                                return response;
                            });
                        });
                        return response.then((apiResponse)=>{
                            const resp = listFilesResponseFromMldev(apiResponse);
                            const typedResp = new ListFilesResponse();
                            Object.assign(typedResp, resp);
                            return typedResp;
                        });
                    }
                }
                async createInternal(params) {
                    var _a, _b;
                    let response;
                    let path = '';
                    let queryParams = {};
                    if (this.apiClient.isVertexAI()) throw new Error('This method is only supported by the Gemini Developer API.');
                    else {
                        const body = createFileParametersToMldev(params);
                        path = formatMap('upload/v1beta/files', body['_url']);
                        queryParams = body['_query'];
                        delete body['_url'];
                        delete body['_query'];
                        response = this.apiClient.request({
                            path: path,
                            queryParams: queryParams,
                            body: JSON.stringify(body),
                            httpMethod: 'POST',
                            httpOptions: (_a = params.config) === null || _a === void 0 ? void 0 : _a.httpOptions,
                            abortSignal: (_b = params.config) === null || _b === void 0 ? void 0 : _b.abortSignal
                        }).then((httpResponse)=>{
                            return httpResponse.json();
                        });
                        return response.then((apiResponse)=>{
                            const resp = createFileResponseFromMldev(apiResponse);
                            const typedResp = new CreateFileResponse();
                            Object.assign(typedResp, resp);
                            return typedResp;
                        });
                    }
                }
                async get(params) {
                    var _a, _b;
                    let response;
                    let path = '';
                    let queryParams = {};
                    if (this.apiClient.isVertexAI()) throw new Error('This method is only supported by the Gemini Developer API.');
                    else {
                        const body = getFileParametersToMldev(params);
                        path = formatMap('files/{file}', body['_url']);
                        queryParams = body['_query'];
                        delete body['_url'];
                        delete body['_query'];
                        response = this.apiClient.request({
                            path: path,
                            queryParams: queryParams,
                            body: JSON.stringify(body),
                            httpMethod: 'GET',
                            httpOptions: (_a = params.config) === null || _a === void 0 ? void 0 : _a.httpOptions,
                            abortSignal: (_b = params.config) === null || _b === void 0 ? void 0 : _b.abortSignal
                        }).then((httpResponse)=>{
                            return httpResponse.json();
                        });
                        return response.then((resp)=>{
                            return resp;
                        });
                    }
                }
                async delete(params) {
                    var _a, _b;
                    let response;
                    let path = '';
                    let queryParams = {};
                    if (this.apiClient.isVertexAI()) throw new Error('This method is only supported by the Gemini Developer API.');
                    else {
                        const body = deleteFileParametersToMldev(params);
                        path = formatMap('files/{file}', body['_url']);
                        queryParams = body['_query'];
                        delete body['_url'];
                        delete body['_query'];
                        response = this.apiClient.request({
                            path: path,
                            queryParams: queryParams,
                            body: JSON.stringify(body),
                            httpMethod: 'DELETE',
                            httpOptions: (_a = params.config) === null || _a === void 0 ? void 0 : _a.httpOptions,
                            abortSignal: (_b = params.config) === null || _b === void 0 ? void 0 : _b.abortSignal
                        }).then((httpResponse)=>{
                            return httpResponse.json().then((jsonResponse)=>{
                                const response = jsonResponse;
                                response.sdkHttpResponse = {
                                    headers: httpResponse.headers
                                };
                                return response;
                            });
                        });
                        return response.then((apiResponse)=>{
                            const resp = deleteFileResponseFromMldev(apiResponse);
                            const typedResp = new DeleteFileResponse();
                            Object.assign(typedResp, resp);
                            return typedResp;
                        });
                    }
                }
            }
            function blobToMldev$2(fromObject) {
                const toObject = {};
                const fromData = getValueByPath(fromObject, [
                    'data'
                ]);
                if (fromData != null) setValueByPath(toObject, [
                    'data'
                ], fromData);
                if (getValueByPath(fromObject, [
                    'displayName'
                ]) !== undefined) throw new Error('displayName parameter is not supported in Gemini API.');
                const fromMimeType = getValueByPath(fromObject, [
                    'mimeType'
                ]);
                if (fromMimeType != null) setValueByPath(toObject, [
                    'mimeType'
                ], fromMimeType);
                return toObject;
            }
            function contentToMldev$2(fromObject) {
                const toObject = {};
                const fromParts = getValueByPath(fromObject, [
                    'parts'
                ]);
                if (fromParts != null) {
                    let transformedList = fromParts;
                    if (Array.isArray(transformedList)) transformedList = transformedList.map((item)=>{
                        return partToMldev$2(item);
                    });
                    setValueByPath(toObject, [
                        'parts'
                    ], transformedList);
                }
                const fromRole = getValueByPath(fromObject, [
                    'role'
                ]);
                if (fromRole != null) setValueByPath(toObject, [
                    'role'
                ], fromRole);
                return toObject;
            }
            function fileDataToMldev$2(fromObject) {
                const toObject = {};
                if (getValueByPath(fromObject, [
                    'displayName'
                ]) !== undefined) throw new Error('displayName parameter is not supported in Gemini API.');
                const fromFileUri = getValueByPath(fromObject, [
                    'fileUri'
                ]);
                if (fromFileUri != null) setValueByPath(toObject, [
                    'fileUri'
                ], fromFileUri);
                const fromMimeType = getValueByPath(fromObject, [
                    'mimeType'
                ]);
                if (fromMimeType != null) setValueByPath(toObject, [
                    'mimeType'
                ], fromMimeType);
                return toObject;
            }
            function functionCallToMldev$2(fromObject) {
                const toObject = {};
                const fromId = getValueByPath(fromObject, [
                    'id'
                ]);
                if (fromId != null) setValueByPath(toObject, [
                    'id'
                ], fromId);
                const fromArgs = getValueByPath(fromObject, [
                    'args'
                ]);
                if (fromArgs != null) setValueByPath(toObject, [
                    'args'
                ], fromArgs);
                const fromName = getValueByPath(fromObject, [
                    'name'
                ]);
                if (fromName != null) setValueByPath(toObject, [
                    'name'
                ], fromName);
                if (getValueByPath(fromObject, [
                    'partialArgs'
                ]) !== undefined) throw new Error('partialArgs parameter is not supported in Gemini API.');
                if (getValueByPath(fromObject, [
                    'willContinue'
                ]) !== undefined) throw new Error('willContinue parameter is not supported in Gemini API.');
                return toObject;
            }
            function functionDeclarationToVertex$1(fromObject) {
                const toObject = {};
                if (getValueByPath(fromObject, [
                    'behavior'
                ]) !== undefined) throw new Error('behavior parameter is not supported in Vertex AI.');
                const fromDescription = getValueByPath(fromObject, [
                    'description'
                ]);
                if (fromDescription != null) setValueByPath(toObject, [
                    'description'
                ], fromDescription);
                const fromName = getValueByPath(fromObject, [
                    'name'
                ]);
                if (fromName != null) setValueByPath(toObject, [
                    'name'
                ], fromName);
                const fromParameters = getValueByPath(fromObject, [
                    'parameters'
                ]);
                if (fromParameters != null) setValueByPath(toObject, [
                    'parameters'
                ], fromParameters);
                const fromParametersJsonSchema = getValueByPath(fromObject, [
                    'parametersJsonSchema'
                ]);
                if (fromParametersJsonSchema != null) setValueByPath(toObject, [
                    'parametersJsonSchema'
                ], fromParametersJsonSchema);
                const fromResponse = getValueByPath(fromObject, [
                    'response'
                ]);
                if (fromResponse != null) setValueByPath(toObject, [
                    'response'
                ], fromResponse);
                const fromResponseJsonSchema = getValueByPath(fromObject, [
                    'responseJsonSchema'
                ]);
                if (fromResponseJsonSchema != null) setValueByPath(toObject, [
                    'responseJsonSchema'
                ], fromResponseJsonSchema);
                return toObject;
            }
            function generationConfigToVertex$1(fromObject) {
                const toObject = {};
                const fromModelSelectionConfig = getValueByPath(fromObject, [
                    'modelSelectionConfig'
                ]);
                if (fromModelSelectionConfig != null) setValueByPath(toObject, [
                    'modelConfig'
                ], fromModelSelectionConfig);
                const fromResponseJsonSchema = getValueByPath(fromObject, [
                    'responseJsonSchema'
                ]);
                if (fromResponseJsonSchema != null) setValueByPath(toObject, [
                    'responseJsonSchema'
                ], fromResponseJsonSchema);
                const fromAudioTimestamp = getValueByPath(fromObject, [
                    'audioTimestamp'
                ]);
                if (fromAudioTimestamp != null) setValueByPath(toObject, [
                    'audioTimestamp'
                ], fromAudioTimestamp);
                const fromCandidateCount = getValueByPath(fromObject, [
                    'candidateCount'
                ]);
                if (fromCandidateCount != null) setValueByPath(toObject, [
                    'candidateCount'
                ], fromCandidateCount);
                const fromEnableAffectiveDialog = getValueByPath(fromObject, [
                    'enableAffectiveDialog'
                ]);
                if (fromEnableAffectiveDialog != null) setValueByPath(toObject, [
                    'enableAffectiveDialog'
                ], fromEnableAffectiveDialog);
                const fromFrequencyPenalty = getValueByPath(fromObject, [
                    'frequencyPenalty'
                ]);
                if (fromFrequencyPenalty != null) setValueByPath(toObject, [
                    'frequencyPenalty'
                ], fromFrequencyPenalty);
                const fromLogprobs = getValueByPath(fromObject, [
                    'logprobs'
                ]);
                if (fromLogprobs != null) setValueByPath(toObject, [
                    'logprobs'
                ], fromLogprobs);
                const fromMaxOutputTokens = getValueByPath(fromObject, [
                    'maxOutputTokens'
                ]);
                if (fromMaxOutputTokens != null) setValueByPath(toObject, [
                    'maxOutputTokens'
                ], fromMaxOutputTokens);
                const fromMediaResolution = getValueByPath(fromObject, [
                    'mediaResolution'
                ]);
                if (fromMediaResolution != null) setValueByPath(toObject, [
                    'mediaResolution'
                ], fromMediaResolution);
                const fromPresencePenalty = getValueByPath(fromObject, [
                    'presencePenalty'
                ]);
                if (fromPresencePenalty != null) setValueByPath(toObject, [
                    'presencePenalty'
                ], fromPresencePenalty);
                const fromResponseLogprobs = getValueByPath(fromObject, [
                    'responseLogprobs'
                ]);
                if (fromResponseLogprobs != null) setValueByPath(toObject, [
                    'responseLogprobs'
                ], fromResponseLogprobs);
                const fromResponseMimeType = getValueByPath(fromObject, [
                    'responseMimeType'
                ]);
                if (fromResponseMimeType != null) setValueByPath(toObject, [
                    'responseMimeType'
                ], fromResponseMimeType);
                const fromResponseModalities = getValueByPath(fromObject, [
                    'responseModalities'
                ]);
                if (fromResponseModalities != null) setValueByPath(toObject, [
                    'responseModalities'
                ], fromResponseModalities);
                const fromResponseSchema = getValueByPath(fromObject, [
                    'responseSchema'
                ]);
                if (fromResponseSchema != null) setValueByPath(toObject, [
                    'responseSchema'
                ], fromResponseSchema);
                const fromRoutingConfig = getValueByPath(fromObject, [
                    'routingConfig'
                ]);
                if (fromRoutingConfig != null) setValueByPath(toObject, [
                    'routingConfig'
                ], fromRoutingConfig);
                const fromSeed = getValueByPath(fromObject, [
                    'seed'
                ]);
                if (fromSeed != null) setValueByPath(toObject, [
                    'seed'
                ], fromSeed);
                const fromSpeechConfig = getValueByPath(fromObject, [
                    'speechConfig'
                ]);
                if (fromSpeechConfig != null) setValueByPath(toObject, [
                    'speechConfig'
                ], fromSpeechConfig);
                const fromStopSequences = getValueByPath(fromObject, [
                    'stopSequences'
                ]);
                if (fromStopSequences != null) setValueByPath(toObject, [
                    'stopSequences'
                ], fromStopSequences);
                const fromTemperature = getValueByPath(fromObject, [
                    'temperature'
                ]);
                if (fromTemperature != null) setValueByPath(toObject, [
                    'temperature'
                ], fromTemperature);
                const fromThinkingConfig = getValueByPath(fromObject, [
                    'thinkingConfig'
                ]);
                if (fromThinkingConfig != null) setValueByPath(toObject, [
                    'thinkingConfig'
                ], fromThinkingConfig);
                const fromTopK = getValueByPath(fromObject, [
                    'topK'
                ]);
                if (fromTopK != null) setValueByPath(toObject, [
                    'topK'
                ], fromTopK);
                const fromTopP = getValueByPath(fromObject, [
                    'topP'
                ]);
                if (fromTopP != null) setValueByPath(toObject, [
                    'topP'
                ], fromTopP);
                if (getValueByPath(fromObject, [
                    'enableEnhancedCivicAnswers'
                ]) !== undefined) throw new Error('enableEnhancedCivicAnswers parameter is not supported in Vertex AI.');
                return toObject;
            }
            function googleMapsToMldev$2(fromObject) {
                const toObject = {};
                if (getValueByPath(fromObject, [
                    'authConfig'
                ]) !== undefined) throw new Error('authConfig parameter is not supported in Gemini API.');
                const fromEnableWidget = getValueByPath(fromObject, [
                    'enableWidget'
                ]);
                if (fromEnableWidget != null) setValueByPath(toObject, [
                    'enableWidget'
                ], fromEnableWidget);
                return toObject;
            }
            function googleSearchToMldev$2(fromObject) {
                const toObject = {};
                if (getValueByPath(fromObject, [
                    'excludeDomains'
                ]) !== undefined) throw new Error('excludeDomains parameter is not supported in Gemini API.');
                if (getValueByPath(fromObject, [
                    'blockingConfidence'
                ]) !== undefined) throw new Error('blockingConfidence parameter is not supported in Gemini API.');
                const fromTimeRangeFilter = getValueByPath(fromObject, [
                    'timeRangeFilter'
                ]);
                if (fromTimeRangeFilter != null) setValueByPath(toObject, [
                    'timeRangeFilter'
                ], fromTimeRangeFilter);
                return toObject;
            }
            function liveConnectConfigToMldev$1(fromObject, parentObject) {
                const toObject = {};
                const fromGenerationConfig = getValueByPath(fromObject, [
                    'generationConfig'
                ]);
                if (parentObject !== undefined && fromGenerationConfig != null) setValueByPath(parentObject, [
                    'setup',
                    'generationConfig'
                ], fromGenerationConfig);
                const fromResponseModalities = getValueByPath(fromObject, [
                    'responseModalities'
                ]);
                if (parentObject !== undefined && fromResponseModalities != null) setValueByPath(parentObject, [
                    'setup',
                    'generationConfig',
                    'responseModalities'
                ], fromResponseModalities);
                const fromTemperature = getValueByPath(fromObject, [
                    'temperature'
                ]);
                if (parentObject !== undefined && fromTemperature != null) setValueByPath(parentObject, [
                    'setup',
                    'generationConfig',
                    'temperature'
                ], fromTemperature);
                const fromTopP = getValueByPath(fromObject, [
                    'topP'
                ]);
                if (parentObject !== undefined && fromTopP != null) setValueByPath(parentObject, [
                    'setup',
                    'generationConfig',
                    'topP'
                ], fromTopP);
                const fromTopK = getValueByPath(fromObject, [
                    'topK'
                ]);
                if (parentObject !== undefined && fromTopK != null) setValueByPath(parentObject, [
                    'setup',
                    'generationConfig',
                    'topK'
                ], fromTopK);
                const fromMaxOutputTokens = getValueByPath(fromObject, [
                    'maxOutputTokens'
                ]);
                if (parentObject !== undefined && fromMaxOutputTokens != null) setValueByPath(parentObject, [
                    'setup',
                    'generationConfig',
                    'maxOutputTokens'
                ], fromMaxOutputTokens);
                const fromMediaResolution = getValueByPath(fromObject, [
                    'mediaResolution'
                ]);
                if (parentObject !== undefined && fromMediaResolution != null) setValueByPath(parentObject, [
                    'setup',
                    'generationConfig',
                    'mediaResolution'
                ], fromMediaResolution);
                const fromSeed = getValueByPath(fromObject, [
                    'seed'
                ]);
                if (parentObject !== undefined && fromSeed != null) setValueByPath(parentObject, [
                    'setup',
                    'generationConfig',
                    'seed'
                ], fromSeed);
                const fromSpeechConfig = getValueByPath(fromObject, [
                    'speechConfig'
                ]);
                if (parentObject !== undefined && fromSpeechConfig != null) setValueByPath(parentObject, [
                    'setup',
                    'generationConfig',
                    'speechConfig'
                ], tLiveSpeechConfig(fromSpeechConfig));
                const fromThinkingConfig = getValueByPath(fromObject, [
                    'thinkingConfig'
                ]);
                if (parentObject !== undefined && fromThinkingConfig != null) setValueByPath(parentObject, [
                    'setup',
                    'generationConfig',
                    'thinkingConfig'
                ], fromThinkingConfig);
                const fromEnableAffectiveDialog = getValueByPath(fromObject, [
                    'enableAffectiveDialog'
                ]);
                if (parentObject !== undefined && fromEnableAffectiveDialog != null) setValueByPath(parentObject, [
                    'setup',
                    'generationConfig',
                    'enableAffectiveDialog'
                ], fromEnableAffectiveDialog);
                const fromSystemInstruction = getValueByPath(fromObject, [
                    'systemInstruction'
                ]);
                if (parentObject !== undefined && fromSystemInstruction != null) setValueByPath(parentObject, [
                    'setup',
                    'systemInstruction'
                ], contentToMldev$2(tContent(fromSystemInstruction)));
                const fromTools = getValueByPath(fromObject, [
                    'tools'
                ]);
                if (parentObject !== undefined && fromTools != null) {
                    let transformedList = tTools(fromTools);
                    if (Array.isArray(transformedList)) transformedList = transformedList.map((item)=>{
                        return toolToMldev$2(tTool(item));
                    });
                    setValueByPath(parentObject, [
                        'setup',
                        'tools'
                    ], transformedList);
                }
                const fromSessionResumption = getValueByPath(fromObject, [
                    'sessionResumption'
                ]);
                if (parentObject !== undefined && fromSessionResumption != null) setValueByPath(parentObject, [
                    'setup',
                    'sessionResumption'
                ], sessionResumptionConfigToMldev$1(fromSessionResumption));
                const fromInputAudioTranscription = getValueByPath(fromObject, [
                    'inputAudioTranscription'
                ]);
                if (parentObject !== undefined && fromInputAudioTranscription != null) setValueByPath(parentObject, [
                    'setup',
                    'inputAudioTranscription'
                ], fromInputAudioTranscription);
                const fromOutputAudioTranscription = getValueByPath(fromObject, [
                    'outputAudioTranscription'
                ]);
                if (parentObject !== undefined && fromOutputAudioTranscription != null) setValueByPath(parentObject, [
                    'setup',
                    'outputAudioTranscription'
                ], fromOutputAudioTranscription);
                const fromRealtimeInputConfig = getValueByPath(fromObject, [
                    'realtimeInputConfig'
                ]);
                if (parentObject !== undefined && fromRealtimeInputConfig != null) setValueByPath(parentObject, [
                    'setup',
                    'realtimeInputConfig'
                ], fromRealtimeInputConfig);
                const fromContextWindowCompression = getValueByPath(fromObject, [
                    'contextWindowCompression'
                ]);
                if (parentObject !== undefined && fromContextWindowCompression != null) setValueByPath(parentObject, [
                    'setup',
                    'contextWindowCompression'
                ], fromContextWindowCompression);
                const fromProactivity = getValueByPath(fromObject, [
                    'proactivity'
                ]);
                if (parentObject !== undefined && fromProactivity != null) setValueByPath(parentObject, [
                    'setup',
                    'proactivity'
                ], fromProactivity);
                if (getValueByPath(fromObject, [
                    'explicitVadSignal'
                ]) !== undefined) throw new Error('explicitVadSignal parameter is not supported in Gemini API.');
                return toObject;
            }
            function liveConnectConfigToVertex(fromObject, parentObject) {
                const toObject = {};
                const fromGenerationConfig = getValueByPath(fromObject, [
                    'generationConfig'
                ]);
                if (parentObject !== undefined && fromGenerationConfig != null) setValueByPath(parentObject, [
                    'setup',
                    'generationConfig'
                ], generationConfigToVertex$1(fromGenerationConfig));
                const fromResponseModalities = getValueByPath(fromObject, [
                    'responseModalities'
                ]);
                if (parentObject !== undefined && fromResponseModalities != null) setValueByPath(parentObject, [
                    'setup',
                    'generationConfig',
                    'responseModalities'
                ], fromResponseModalities);
                const fromTemperature = getValueByPath(fromObject, [
                    'temperature'
                ]);
                if (parentObject !== undefined && fromTemperature != null) setValueByPath(parentObject, [
                    'setup',
                    'generationConfig',
                    'temperature'
                ], fromTemperature);
                const fromTopP = getValueByPath(fromObject, [
                    'topP'
                ]);
                if (parentObject !== undefined && fromTopP != null) setValueByPath(parentObject, [
                    'setup',
                    'generationConfig',
                    'topP'
                ], fromTopP);
                const fromTopK = getValueByPath(fromObject, [
                    'topK'
                ]);
                if (parentObject !== undefined && fromTopK != null) setValueByPath(parentObject, [
                    'setup',
                    'generationConfig',
                    'topK'
                ], fromTopK);
                const fromMaxOutputTokens = getValueByPath(fromObject, [
                    'maxOutputTokens'
                ]);
                if (parentObject !== undefined && fromMaxOutputTokens != null) setValueByPath(parentObject, [
                    'setup',
                    'generationConfig',
                    'maxOutputTokens'
                ], fromMaxOutputTokens);
                const fromMediaResolution = getValueByPath(fromObject, [
                    'mediaResolution'
                ]);
                if (parentObject !== undefined && fromMediaResolution != null) setValueByPath(parentObject, [
                    'setup',
                    'generationConfig',
                    'mediaResolution'
                ], fromMediaResolution);
                const fromSeed = getValueByPath(fromObject, [
                    'seed'
                ]);
                if (parentObject !== undefined && fromSeed != null) setValueByPath(parentObject, [
                    'setup',
                    'generationConfig',
                    'seed'
                ], fromSeed);
                const fromSpeechConfig = getValueByPath(fromObject, [
                    'speechConfig'
                ]);
                if (parentObject !== undefined && fromSpeechConfig != null) setValueByPath(parentObject, [
                    'setup',
                    'generationConfig',
                    'speechConfig'
                ], tLiveSpeechConfig(fromSpeechConfig));
                const fromThinkingConfig = getValueByPath(fromObject, [
                    'thinkingConfig'
                ]);
                if (parentObject !== undefined && fromThinkingConfig != null) setValueByPath(parentObject, [
                    'setup',
                    'generationConfig',
                    'thinkingConfig'
                ], fromThinkingConfig);
                const fromEnableAffectiveDialog = getValueByPath(fromObject, [
                    'enableAffectiveDialog'
                ]);
                if (parentObject !== undefined && fromEnableAffectiveDialog != null) setValueByPath(parentObject, [
                    'setup',
                    'generationConfig',
                    'enableAffectiveDialog'
                ], fromEnableAffectiveDialog);
                const fromSystemInstruction = getValueByPath(fromObject, [
                    'systemInstruction'
                ]);
                if (parentObject !== undefined && fromSystemInstruction != null) setValueByPath(parentObject, [
                    'setup',
                    'systemInstruction'
                ], tContent(fromSystemInstruction));
                const fromTools = getValueByPath(fromObject, [
                    'tools'
                ]);
                if (parentObject !== undefined && fromTools != null) {
                    let transformedList = tTools(fromTools);
                    if (Array.isArray(transformedList)) transformedList = transformedList.map((item)=>{
                        return toolToVertex$1(tTool(item));
                    });
                    setValueByPath(parentObject, [
                        'setup',
                        'tools'
                    ], transformedList);
                }
                const fromSessionResumption = getValueByPath(fromObject, [
                    'sessionResumption'
                ]);
                if (parentObject !== undefined && fromSessionResumption != null) setValueByPath(parentObject, [
                    'setup',
                    'sessionResumption'
                ], fromSessionResumption);
                const fromInputAudioTranscription = getValueByPath(fromObject, [
                    'inputAudioTranscription'
                ]);
                if (parentObject !== undefined && fromInputAudioTranscription != null) setValueByPath(parentObject, [
                    'setup',
                    'inputAudioTranscription'
                ], fromInputAudioTranscription);
                const fromOutputAudioTranscription = getValueByPath(fromObject, [
                    'outputAudioTranscription'
                ]);
                if (parentObject !== undefined && fromOutputAudioTranscription != null) setValueByPath(parentObject, [
                    'setup',
                    'outputAudioTranscription'
                ], fromOutputAudioTranscription);
                const fromRealtimeInputConfig = getValueByPath(fromObject, [
                    'realtimeInputConfig'
                ]);
                if (parentObject !== undefined && fromRealtimeInputConfig != null) setValueByPath(parentObject, [
                    'setup',
                    'realtimeInputConfig'
                ], fromRealtimeInputConfig);
                const fromContextWindowCompression = getValueByPath(fromObject, [
                    'contextWindowCompression'
                ]);
                if (parentObject !== undefined && fromContextWindowCompression != null) setValueByPath(parentObject, [
                    'setup',
                    'contextWindowCompression'
                ], fromContextWindowCompression);
                const fromProactivity = getValueByPath(fromObject, [
                    'proactivity'
                ]);
                if (parentObject !== undefined && fromProactivity != null) setValueByPath(parentObject, [
                    'setup',
                    'proactivity'
                ], fromProactivity);
                const fromExplicitVadSignal = getValueByPath(fromObject, [
                    'explicitVadSignal'
                ]);
                if (parentObject !== undefined && fromExplicitVadSignal != null) setValueByPath(parentObject, [
                    'setup',
                    'explicitVadSignal'
                ], fromExplicitVadSignal);
                return toObject;
            }
            function liveConnectParametersToMldev(apiClient, fromObject) {
                const toObject = {};
                const fromModel = getValueByPath(fromObject, [
                    'model'
                ]);
                if (fromModel != null) setValueByPath(toObject, [
                    'setup',
                    'model'
                ], tModel(apiClient, fromModel));
                const fromConfig = getValueByPath(fromObject, [
                    'config'
                ]);
                if (fromConfig != null) setValueByPath(toObject, [
                    'config'
                ], liveConnectConfigToMldev$1(fromConfig, toObject));
                return toObject;
            }
            function liveConnectParametersToVertex(apiClient, fromObject) {
                const toObject = {};
                const fromModel = getValueByPath(fromObject, [
                    'model'
                ]);
                if (fromModel != null) setValueByPath(toObject, [
                    'setup',
                    'model'
                ], tModel(apiClient, fromModel));
                const fromConfig = getValueByPath(fromObject, [
                    'config'
                ]);
                if (fromConfig != null) setValueByPath(toObject, [
                    'config'
                ], liveConnectConfigToVertex(fromConfig, toObject));
                return toObject;
            }
            function liveMusicSetConfigParametersToMldev(fromObject) {
                const toObject = {};
                const fromMusicGenerationConfig = getValueByPath(fromObject, [
                    'musicGenerationConfig'
                ]);
                if (fromMusicGenerationConfig != null) setValueByPath(toObject, [
                    'musicGenerationConfig'
                ], fromMusicGenerationConfig);
                return toObject;
            }
            function liveMusicSetWeightedPromptsParametersToMldev(fromObject) {
                const toObject = {};
                const fromWeightedPrompts = getValueByPath(fromObject, [
                    'weightedPrompts'
                ]);
                if (fromWeightedPrompts != null) {
                    let transformedList = fromWeightedPrompts;
                    if (Array.isArray(transformedList)) transformedList = transformedList.map((item)=>{
                        return item;
                    });
                    setValueByPath(toObject, [
                        'weightedPrompts'
                    ], transformedList);
                }
                return toObject;
            }
            function liveSendRealtimeInputParametersToMldev(fromObject) {
                const toObject = {};
                const fromMedia = getValueByPath(fromObject, [
                    'media'
                ]);
                if (fromMedia != null) {
                    let transformedList = tBlobs(fromMedia);
                    if (Array.isArray(transformedList)) transformedList = transformedList.map((item)=>{
                        return blobToMldev$2(item);
                    });
                    setValueByPath(toObject, [
                        'mediaChunks'
                    ], transformedList);
                }
                const fromAudio = getValueByPath(fromObject, [
                    'audio'
                ]);
                if (fromAudio != null) setValueByPath(toObject, [
                    'audio'
                ], blobToMldev$2(tAudioBlob(fromAudio)));
                const fromAudioStreamEnd = getValueByPath(fromObject, [
                    'audioStreamEnd'
                ]);
                if (fromAudioStreamEnd != null) setValueByPath(toObject, [
                    'audioStreamEnd'
                ], fromAudioStreamEnd);
                const fromVideo = getValueByPath(fromObject, [
                    'video'
                ]);
                if (fromVideo != null) setValueByPath(toObject, [
                    'video'
                ], blobToMldev$2(tImageBlob(fromVideo)));
                const fromText = getValueByPath(fromObject, [
                    'text'
                ]);
                if (fromText != null) setValueByPath(toObject, [
                    'text'
                ], fromText);
                const fromActivityStart = getValueByPath(fromObject, [
                    'activityStart'
                ]);
                if (fromActivityStart != null) setValueByPath(toObject, [
                    'activityStart'
                ], fromActivityStart);
                const fromActivityEnd = getValueByPath(fromObject, [
                    'activityEnd'
                ]);
                if (fromActivityEnd != null) setValueByPath(toObject, [
                    'activityEnd'
                ], fromActivityEnd);
                return toObject;
            }
            function liveSendRealtimeInputParametersToVertex(fromObject) {
                const toObject = {};
                const fromMedia = getValueByPath(fromObject, [
                    'media'
                ]);
                if (fromMedia != null) {
                    let transformedList = tBlobs(fromMedia);
                    if (Array.isArray(transformedList)) transformedList = transformedList.map((item)=>{
                        return item;
                    });
                    setValueByPath(toObject, [
                        'mediaChunks'
                    ], transformedList);
                }
                const fromAudio = getValueByPath(fromObject, [
                    'audio'
                ]);
                if (fromAudio != null) setValueByPath(toObject, [
                    'audio'
                ], tAudioBlob(fromAudio));
                const fromAudioStreamEnd = getValueByPath(fromObject, [
                    'audioStreamEnd'
                ]);
                if (fromAudioStreamEnd != null) setValueByPath(toObject, [
                    'audioStreamEnd'
                ], fromAudioStreamEnd);
                const fromVideo = getValueByPath(fromObject, [
                    'video'
                ]);
                if (fromVideo != null) setValueByPath(toObject, [
                    'video'
                ], tImageBlob(fromVideo));
                const fromText = getValueByPath(fromObject, [
                    'text'
                ]);
                if (fromText != null) setValueByPath(toObject, [
                    'text'
                ], fromText);
                const fromActivityStart = getValueByPath(fromObject, [
                    'activityStart'
                ]);
                if (fromActivityStart != null) setValueByPath(toObject, [
                    'activityStart'
                ], fromActivityStart);
                const fromActivityEnd = getValueByPath(fromObject, [
                    'activityEnd'
                ]);
                if (fromActivityEnd != null) setValueByPath(toObject, [
                    'activityEnd'
                ], fromActivityEnd);
                return toObject;
            }
            function liveServerMessageFromVertex(fromObject) {
                const toObject = {};
                const fromSetupComplete = getValueByPath(fromObject, [
                    'setupComplete'
                ]);
                if (fromSetupComplete != null) setValueByPath(toObject, [
                    'setupComplete'
                ], fromSetupComplete);
                const fromServerContent = getValueByPath(fromObject, [
                    'serverContent'
                ]);
                if (fromServerContent != null) setValueByPath(toObject, [
                    'serverContent'
                ], fromServerContent);
                const fromToolCall = getValueByPath(fromObject, [
                    'toolCall'
                ]);
                if (fromToolCall != null) setValueByPath(toObject, [
                    'toolCall'
                ], fromToolCall);
                const fromToolCallCancellation = getValueByPath(fromObject, [
                    'toolCallCancellation'
                ]);
                if (fromToolCallCancellation != null) setValueByPath(toObject, [
                    'toolCallCancellation'
                ], fromToolCallCancellation);
                const fromUsageMetadata = getValueByPath(fromObject, [
                    'usageMetadata'
                ]);
                if (fromUsageMetadata != null) setValueByPath(toObject, [
                    'usageMetadata'
                ], usageMetadataFromVertex(fromUsageMetadata));
                const fromGoAway = getValueByPath(fromObject, [
                    'goAway'
                ]);
                if (fromGoAway != null) setValueByPath(toObject, [
                    'goAway'
                ], fromGoAway);
                const fromSessionResumptionUpdate = getValueByPath(fromObject, [
                    'sessionResumptionUpdate'
                ]);
                if (fromSessionResumptionUpdate != null) setValueByPath(toObject, [
                    'sessionResumptionUpdate'
                ], fromSessionResumptionUpdate);
                const fromVoiceActivityDetectionSignal = getValueByPath(fromObject, [
                    'voiceActivityDetectionSignal'
                ]);
                if (fromVoiceActivityDetectionSignal != null) setValueByPath(toObject, [
                    'voiceActivityDetectionSignal'
                ], fromVoiceActivityDetectionSignal);
                return toObject;
            }
            function partToMldev$2(fromObject) {
                const toObject = {};
                const fromMediaResolution = getValueByPath(fromObject, [
                    'mediaResolution'
                ]);
                if (fromMediaResolution != null) setValueByPath(toObject, [
                    'mediaResolution'
                ], fromMediaResolution);
                const fromCodeExecutionResult = getValueByPath(fromObject, [
                    'codeExecutionResult'
                ]);
                if (fromCodeExecutionResult != null) setValueByPath(toObject, [
                    'codeExecutionResult'
                ], fromCodeExecutionResult);
                const fromExecutableCode = getValueByPath(fromObject, [
                    'executableCode'
                ]);
                if (fromExecutableCode != null) setValueByPath(toObject, [
                    'executableCode'
                ], fromExecutableCode);
                const fromFileData = getValueByPath(fromObject, [
                    'fileData'
                ]);
                if (fromFileData != null) setValueByPath(toObject, [
                    'fileData'
                ], fileDataToMldev$2(fromFileData));
                const fromFunctionCall = getValueByPath(fromObject, [
                    'functionCall'
                ]);
                if (fromFunctionCall != null) setValueByPath(toObject, [
                    'functionCall'
                ], functionCallToMldev$2(fromFunctionCall));
                const fromFunctionResponse = getValueByPath(fromObject, [
                    'functionResponse'
                ]);
                if (fromFunctionResponse != null) setValueByPath(toObject, [
                    'functionResponse'
                ], fromFunctionResponse);
                const fromInlineData = getValueByPath(fromObject, [
                    'inlineData'
                ]);
                if (fromInlineData != null) setValueByPath(toObject, [
                    'inlineData'
                ], blobToMldev$2(fromInlineData));
                const fromText = getValueByPath(fromObject, [
                    'text'
                ]);
                if (fromText != null) setValueByPath(toObject, [
                    'text'
                ], fromText);
                const fromThought = getValueByPath(fromObject, [
                    'thought'
                ]);
                if (fromThought != null) setValueByPath(toObject, [
                    'thought'
                ], fromThought);
                const fromThoughtSignature = getValueByPath(fromObject, [
                    'thoughtSignature'
                ]);
                if (fromThoughtSignature != null) setValueByPath(toObject, [
                    'thoughtSignature'
                ], fromThoughtSignature);
                const fromVideoMetadata = getValueByPath(fromObject, [
                    'videoMetadata'
                ]);
                if (fromVideoMetadata != null) setValueByPath(toObject, [
                    'videoMetadata'
                ], fromVideoMetadata);
                return toObject;
            }
            function sessionResumptionConfigToMldev$1(fromObject) {
                const toObject = {};
                const fromHandle = getValueByPath(fromObject, [
                    'handle'
                ]);
                if (fromHandle != null) setValueByPath(toObject, [
                    'handle'
                ], fromHandle);
                if (getValueByPath(fromObject, [
                    'transparent'
                ]) !== undefined) throw new Error('transparent parameter is not supported in Gemini API.');
                return toObject;
            }
            function toolToMldev$2(fromObject) {
                const toObject = {};
                const fromFunctionDeclarations = getValueByPath(fromObject, [
                    'functionDeclarations'
                ]);
                if (fromFunctionDeclarations != null) {
                    let transformedList = fromFunctionDeclarations;
                    if (Array.isArray(transformedList)) transformedList = transformedList.map((item)=>{
                        return item;
                    });
                    setValueByPath(toObject, [
                        'functionDeclarations'
                    ], transformedList);
                }
                if (getValueByPath(fromObject, [
                    'retrieval'
                ]) !== undefined) throw new Error('retrieval parameter is not supported in Gemini API.');
                const fromGoogleSearchRetrieval = getValueByPath(fromObject, [
                    'googleSearchRetrieval'
                ]);
                if (fromGoogleSearchRetrieval != null) setValueByPath(toObject, [
                    'googleSearchRetrieval'
                ], fromGoogleSearchRetrieval);
                const fromComputerUse = getValueByPath(fromObject, [
                    'computerUse'
                ]);
                if (fromComputerUse != null) setValueByPath(toObject, [
                    'computerUse'
                ], fromComputerUse);
                const fromFileSearch = getValueByPath(fromObject, [
                    'fileSearch'
                ]);
                if (fromFileSearch != null) setValueByPath(toObject, [
                    'fileSearch'
                ], fromFileSearch);
                const fromCodeExecution = getValueByPath(fromObject, [
                    'codeExecution'
                ]);
                if (fromCodeExecution != null) setValueByPath(toObject, [
                    'codeExecution'
                ], fromCodeExecution);
                if (getValueByPath(fromObject, [
                    'enterpriseWebSearch'
                ]) !== undefined) throw new Error('enterpriseWebSearch parameter is not supported in Gemini API.');
                const fromGoogleMaps = getValueByPath(fromObject, [
                    'googleMaps'
                ]);
                if (fromGoogleMaps != null) setValueByPath(toObject, [
                    'googleMaps'
                ], googleMapsToMldev$2(fromGoogleMaps));
                const fromGoogleSearch = getValueByPath(fromObject, [
                    'googleSearch'
                ]);
                if (fromGoogleSearch != null) setValueByPath(toObject, [
                    'googleSearch'
                ], googleSearchToMldev$2(fromGoogleSearch));
                const fromUrlContext = getValueByPath(fromObject, [
                    'urlContext'
                ]);
                if (fromUrlContext != null) setValueByPath(toObject, [
                    'urlContext'
                ], fromUrlContext);
                return toObject;
            }
            function toolToVertex$1(fromObject) {
                const toObject = {};
                const fromFunctionDeclarations = getValueByPath(fromObject, [
                    'functionDeclarations'
                ]);
                if (fromFunctionDeclarations != null) {
                    let transformedList = fromFunctionDeclarations;
                    if (Array.isArray(transformedList)) transformedList = transformedList.map((item)=>{
                        return functionDeclarationToVertex$1(item);
                    });
                    setValueByPath(toObject, [
                        'functionDeclarations'
                    ], transformedList);
                }
                const fromRetrieval = getValueByPath(fromObject, [
                    'retrieval'
                ]);
                if (fromRetrieval != null) setValueByPath(toObject, [
                    'retrieval'
                ], fromRetrieval);
                const fromGoogleSearchRetrieval = getValueByPath(fromObject, [
                    'googleSearchRetrieval'
                ]);
                if (fromGoogleSearchRetrieval != null) setValueByPath(toObject, [
                    'googleSearchRetrieval'
                ], fromGoogleSearchRetrieval);
                const fromComputerUse = getValueByPath(fromObject, [
                    'computerUse'
                ]);
                if (fromComputerUse != null) setValueByPath(toObject, [
                    'computerUse'
                ], fromComputerUse);
                if (getValueByPath(fromObject, [
                    'fileSearch'
                ]) !== undefined) throw new Error('fileSearch parameter is not supported in Vertex AI.');
                const fromCodeExecution = getValueByPath(fromObject, [
                    'codeExecution'
                ]);
                if (fromCodeExecution != null) setValueByPath(toObject, [
                    'codeExecution'
                ], fromCodeExecution);
                const fromEnterpriseWebSearch = getValueByPath(fromObject, [
                    'enterpriseWebSearch'
                ]);
                if (fromEnterpriseWebSearch != null) setValueByPath(toObject, [
                    'enterpriseWebSearch'
                ], fromEnterpriseWebSearch);
                const fromGoogleMaps = getValueByPath(fromObject, [
                    'googleMaps'
                ]);
                if (fromGoogleMaps != null) setValueByPath(toObject, [
                    'googleMaps'
                ], fromGoogleMaps);
                const fromGoogleSearch = getValueByPath(fromObject, [
                    'googleSearch'
                ]);
                if (fromGoogleSearch != null) setValueByPath(toObject, [
                    'googleSearch'
                ], fromGoogleSearch);
                const fromUrlContext = getValueByPath(fromObject, [
                    'urlContext'
                ]);
                if (fromUrlContext != null) setValueByPath(toObject, [
                    'urlContext'
                ], fromUrlContext);
                return toObject;
            }
            function usageMetadataFromVertex(fromObject) {
                const toObject = {};
                const fromPromptTokenCount = getValueByPath(fromObject, [
                    'promptTokenCount'
                ]);
                if (fromPromptTokenCount != null) setValueByPath(toObject, [
                    'promptTokenCount'
                ], fromPromptTokenCount);
                const fromCachedContentTokenCount = getValueByPath(fromObject, [
                    'cachedContentTokenCount'
                ]);
                if (fromCachedContentTokenCount != null) setValueByPath(toObject, [
                    'cachedContentTokenCount'
                ], fromCachedContentTokenCount);
                const fromResponseTokenCount = getValueByPath(fromObject, [
                    'candidatesTokenCount'
                ]);
                if (fromResponseTokenCount != null) setValueByPath(toObject, [
                    'responseTokenCount'
                ], fromResponseTokenCount);
                const fromToolUsePromptTokenCount = getValueByPath(fromObject, [
                    'toolUsePromptTokenCount'
                ]);
                if (fromToolUsePromptTokenCount != null) setValueByPath(toObject, [
                    'toolUsePromptTokenCount'
                ], fromToolUsePromptTokenCount);
                const fromThoughtsTokenCount = getValueByPath(fromObject, [
                    'thoughtsTokenCount'
                ]);
                if (fromThoughtsTokenCount != null) setValueByPath(toObject, [
                    'thoughtsTokenCount'
                ], fromThoughtsTokenCount);
                const fromTotalTokenCount = getValueByPath(fromObject, [
                    'totalTokenCount'
                ]);
                if (fromTotalTokenCount != null) setValueByPath(toObject, [
                    'totalTokenCount'
                ], fromTotalTokenCount);
                const fromPromptTokensDetails = getValueByPath(fromObject, [
                    'promptTokensDetails'
                ]);
                if (fromPromptTokensDetails != null) {
                    let transformedList = fromPromptTokensDetails;
                    if (Array.isArray(transformedList)) transformedList = transformedList.map((item)=>{
                        return item;
                    });
                    setValueByPath(toObject, [
                        'promptTokensDetails'
                    ], transformedList);
                }
                const fromCacheTokensDetails = getValueByPath(fromObject, [
                    'cacheTokensDetails'
                ]);
                if (fromCacheTokensDetails != null) {
                    let transformedList = fromCacheTokensDetails;
                    if (Array.isArray(transformedList)) transformedList = transformedList.map((item)=>{
                        return item;
                    });
                    setValueByPath(toObject, [
                        'cacheTokensDetails'
                    ], transformedList);
                }
                const fromResponseTokensDetails = getValueByPath(fromObject, [
                    'candidatesTokensDetails'
                ]);
                if (fromResponseTokensDetails != null) {
                    let transformedList = fromResponseTokensDetails;
                    if (Array.isArray(transformedList)) transformedList = transformedList.map((item)=>{
                        return item;
                    });
                    setValueByPath(toObject, [
                        'responseTokensDetails'
                    ], transformedList);
                }
                const fromToolUsePromptTokensDetails = getValueByPath(fromObject, [
                    'toolUsePromptTokensDetails'
                ]);
                if (fromToolUsePromptTokensDetails != null) {
                    let transformedList = fromToolUsePromptTokensDetails;
                    if (Array.isArray(transformedList)) transformedList = transformedList.map((item)=>{
                        return item;
                    });
                    setValueByPath(toObject, [
                        'toolUsePromptTokensDetails'
                    ], transformedList);
                }
                const fromTrafficType = getValueByPath(fromObject, [
                    'trafficType'
                ]);
                if (fromTrafficType != null) setValueByPath(toObject, [
                    'trafficType'
                ], fromTrafficType);
                return toObject;
            }
            function blobToMldev$1(fromObject) {
                const toObject = {};
                const fromData = getValueByPath(fromObject, [
                    'data'
                ]);
                if (fromData != null) setValueByPath(toObject, [
                    'data'
                ], fromData);
                if (getValueByPath(fromObject, [
                    'displayName'
                ]) !== undefined) throw new Error('displayName parameter is not supported in Gemini API.');
                const fromMimeType = getValueByPath(fromObject, [
                    'mimeType'
                ]);
                if (fromMimeType != null) setValueByPath(toObject, [
                    'mimeType'
                ], fromMimeType);
                return toObject;
            }
            function candidateFromMldev(fromObject) {
                const toObject = {};
                const fromContent = getValueByPath(fromObject, [
                    'content'
                ]);
                if (fromContent != null) setValueByPath(toObject, [
                    'content'
                ], fromContent);
                const fromCitationMetadata = getValueByPath(fromObject, [
                    'citationMetadata'
                ]);
                if (fromCitationMetadata != null) setValueByPath(toObject, [
                    'citationMetadata'
                ], citationMetadataFromMldev(fromCitationMetadata));
                const fromTokenCount = getValueByPath(fromObject, [
                    'tokenCount'
                ]);
                if (fromTokenCount != null) setValueByPath(toObject, [
                    'tokenCount'
                ], fromTokenCount);
                const fromFinishReason = getValueByPath(fromObject, [
                    'finishReason'
                ]);
                if (fromFinishReason != null) setValueByPath(toObject, [
                    'finishReason'
                ], fromFinishReason);
                const fromAvgLogprobs = getValueByPath(fromObject, [
                    'avgLogprobs'
                ]);
                if (fromAvgLogprobs != null) setValueByPath(toObject, [
                    'avgLogprobs'
                ], fromAvgLogprobs);
                const fromGroundingMetadata = getValueByPath(fromObject, [
                    'groundingMetadata'
                ]);
                if (fromGroundingMetadata != null) setValueByPath(toObject, [
                    'groundingMetadata'
                ], fromGroundingMetadata);
                const fromIndex = getValueByPath(fromObject, [
                    'index'
                ]);
                if (fromIndex != null) setValueByPath(toObject, [
                    'index'
                ], fromIndex);
                const fromLogprobsResult = getValueByPath(fromObject, [
                    'logprobsResult'
                ]);
                if (fromLogprobsResult != null) setValueByPath(toObject, [
                    'logprobsResult'
                ], fromLogprobsResult);
                const fromSafetyRatings = getValueByPath(fromObject, [
                    'safetyRatings'
                ]);
                if (fromSafetyRatings != null) {
                    let transformedList = fromSafetyRatings;
                    if (Array.isArray(transformedList)) transformedList = transformedList.map((item)=>{
                        return item;
                    });
                    setValueByPath(toObject, [
                        'safetyRatings'
                    ], transformedList);
                }
                const fromUrlContextMetadata = getValueByPath(fromObject, [
                    'urlContextMetadata'
                ]);
                if (fromUrlContextMetadata != null) setValueByPath(toObject, [
                    'urlContextMetadata'
                ], fromUrlContextMetadata);
                return toObject;
            }
            function citationMetadataFromMldev(fromObject) {
                const toObject = {};
                const fromCitations = getValueByPath(fromObject, [
                    'citationSources'
                ]);
                if (fromCitations != null) {
                    let transformedList = fromCitations;
                    if (Array.isArray(transformedList)) transformedList = transformedList.map((item)=>{
                        return item;
                    });
                    setValueByPath(toObject, [
                        'citations'
                    ], transformedList);
                }
                return toObject;
            }
            function computeTokensParametersToVertex(apiClient, fromObject) {
                const toObject = {};
                const fromModel = getValueByPath(fromObject, [
                    'model'
                ]);
                if (fromModel != null) setValueByPath(toObject, [
                    '_url',
                    'model'
                ], tModel(apiClient, fromModel));
                const fromContents = getValueByPath(fromObject, [
                    'contents'
                ]);
                if (fromContents != null) {
                    let transformedList = tContents(fromContents);
                    if (Array.isArray(transformedList)) transformedList = transformedList.map((item)=>{
                        return item;
                    });
                    setValueByPath(toObject, [
                        'contents'
                    ], transformedList);
                }
                return toObject;
            }
            function computeTokensResponseFromVertex(fromObject) {
                const toObject = {};
                const fromSdkHttpResponse = getValueByPath(fromObject, [
                    'sdkHttpResponse'
                ]);
                if (fromSdkHttpResponse != null) setValueByPath(toObject, [
                    'sdkHttpResponse'
                ], fromSdkHttpResponse);
                const fromTokensInfo = getValueByPath(fromObject, [
                    'tokensInfo'
                ]);
                if (fromTokensInfo != null) {
                    let transformedList = fromTokensInfo;
                    if (Array.isArray(transformedList)) transformedList = transformedList.map((item)=>{
                        return item;
                    });
                    setValueByPath(toObject, [
                        'tokensInfo'
                    ], transformedList);
                }
                return toObject;
            }
            function contentEmbeddingFromVertex(fromObject) {
                const toObject = {};
                const fromValues = getValueByPath(fromObject, [
                    'values'
                ]);
                if (fromValues != null) setValueByPath(toObject, [
                    'values'
                ], fromValues);
                const fromStatistics = getValueByPath(fromObject, [
                    'statistics'
                ]);
                if (fromStatistics != null) setValueByPath(toObject, [
                    'statistics'
                ], contentEmbeddingStatisticsFromVertex(fromStatistics));
                return toObject;
            }
            function contentEmbeddingStatisticsFromVertex(fromObject) {
                const toObject = {};
                const fromTruncated = getValueByPath(fromObject, [
                    'truncated'
                ]);
                if (fromTruncated != null) setValueByPath(toObject, [
                    'truncated'
                ], fromTruncated);
                const fromTokenCount = getValueByPath(fromObject, [
                    'token_count'
                ]);
                if (fromTokenCount != null) setValueByPath(toObject, [
                    'tokenCount'
                ], fromTokenCount);
                return toObject;
            }
            function contentToMldev$1(fromObject) {
                const toObject = {};
                const fromParts = getValueByPath(fromObject, [
                    'parts'
                ]);
                if (fromParts != null) {
                    let transformedList = fromParts;
                    if (Array.isArray(transformedList)) transformedList = transformedList.map((item)=>{
                        return partToMldev$1(item);
                    });
                    setValueByPath(toObject, [
                        'parts'
                    ], transformedList);
                }
                const fromRole = getValueByPath(fromObject, [
                    'role'
                ]);
                if (fromRole != null) setValueByPath(toObject, [
                    'role'
                ], fromRole);
                return toObject;
            }
            function controlReferenceConfigToVertex(fromObject) {
                const toObject = {};
                const fromControlType = getValueByPath(fromObject, [
                    'controlType'
                ]);
                if (fromControlType != null) setValueByPath(toObject, [
                    'controlType'
                ], fromControlType);
                const fromEnableControlImageComputation = getValueByPath(fromObject, [
                    'enableControlImageComputation'
                ]);
                if (fromEnableControlImageComputation != null) setValueByPath(toObject, [
                    'computeControl'
                ], fromEnableControlImageComputation);
                return toObject;
            }
            function countTokensConfigToMldev(fromObject) {
                const toObject = {};
                if (getValueByPath(fromObject, [
                    'systemInstruction'
                ]) !== undefined) throw new Error('systemInstruction parameter is not supported in Gemini API.');
                if (getValueByPath(fromObject, [
                    'tools'
                ]) !== undefined) throw new Error('tools parameter is not supported in Gemini API.');
                if (getValueByPath(fromObject, [
                    'generationConfig'
                ]) !== undefined) throw new Error('generationConfig parameter is not supported in Gemini API.');
                return toObject;
            }
            function countTokensConfigToVertex(fromObject, parentObject) {
                const toObject = {};
                const fromSystemInstruction = getValueByPath(fromObject, [
                    'systemInstruction'
                ]);
                if (parentObject !== undefined && fromSystemInstruction != null) setValueByPath(parentObject, [
                    'systemInstruction'
                ], tContent(fromSystemInstruction));
                const fromTools = getValueByPath(fromObject, [
                    'tools'
                ]);
                if (parentObject !== undefined && fromTools != null) {
                    let transformedList = fromTools;
                    if (Array.isArray(transformedList)) transformedList = transformedList.map((item)=>{
                        return toolToVertex(item);
                    });
                    setValueByPath(parentObject, [
                        'tools'
                    ], transformedList);
                }
                const fromGenerationConfig = getValueByPath(fromObject, [
                    'generationConfig'
                ]);
                if (parentObject !== undefined && fromGenerationConfig != null) setValueByPath(parentObject, [
                    'generationConfig'
                ], generationConfigToVertex(fromGenerationConfig));
                return toObject;
            }
            function countTokensParametersToMldev(apiClient, fromObject) {
                const toObject = {};
                const fromModel = getValueByPath(fromObject, [
                    'model'
                ]);
                if (fromModel != null) setValueByPath(toObject, [
                    '_url',
                    'model'
                ], tModel(apiClient, fromModel));
                const fromContents = getValueByPath(fromObject, [
                    'contents'
                ]);
                if (fromContents != null) {
                    let transformedList = tContents(fromContents);
                    if (Array.isArray(transformedList)) transformedList = transformedList.map((item)=>{
                        return contentToMldev$1(item);
                    });
                    setValueByPath(toObject, [
                        'contents'
                    ], transformedList);
                }
                const fromConfig = getValueByPath(fromObject, [
                    'config'
                ]);
                if (fromConfig != null) countTokensConfigToMldev(fromConfig);
                return toObject;
            }
            function countTokensParametersToVertex(apiClient, fromObject) {
                const toObject = {};
                const fromModel = getValueByPath(fromObject, [
                    'model'
                ]);
                if (fromModel != null) setValueByPath(toObject, [
                    '_url',
                    'model'
                ], tModel(apiClient, fromModel));
                const fromContents = getValueByPath(fromObject, [
                    'contents'
                ]);
                if (fromContents != null) {
                    let transformedList = tContents(fromContents);
                    if (Array.isArray(transformedList)) transformedList = transformedList.map((item)=>{
                        return item;
                    });
                    setValueByPath(toObject, [
                        'contents'
                    ], transformedList);
                }
                const fromConfig = getValueByPath(fromObject, [
                    'config'
                ]);
                if (fromConfig != null) countTokensConfigToVertex(fromConfig, toObject);
                return toObject;
            }
            function countTokensResponseFromMldev(fromObject) {
                const toObject = {};
                const fromSdkHttpResponse = getValueByPath(fromObject, [
                    'sdkHttpResponse'
                ]);
                if (fromSdkHttpResponse != null) setValueByPath(toObject, [
                    'sdkHttpResponse'
                ], fromSdkHttpResponse);
                const fromTotalTokens = getValueByPath(fromObject, [
                    'totalTokens'
                ]);
                if (fromTotalTokens != null) setValueByPath(toObject, [
                    'totalTokens'
                ], fromTotalTokens);
                const fromCachedContentTokenCount = getValueByPath(fromObject, [
                    'cachedContentTokenCount'
                ]);
                if (fromCachedContentTokenCount != null) setValueByPath(toObject, [
                    'cachedContentTokenCount'
                ], fromCachedContentTokenCount);
                return toObject;
            }
            function countTokensResponseFromVertex(fromObject) {
                const toObject = {};
                const fromSdkHttpResponse = getValueByPath(fromObject, [
                    'sdkHttpResponse'
                ]);
                if (fromSdkHttpResponse != null) setValueByPath(toObject, [
                    'sdkHttpResponse'
                ], fromSdkHttpResponse);
                const fromTotalTokens = getValueByPath(fromObject, [
                    'totalTokens'
                ]);
                if (fromTotalTokens != null) setValueByPath(toObject, [
                    'totalTokens'
                ], fromTotalTokens);
                return toObject;
            }
            function deleteModelParametersToMldev(apiClient, fromObject) {
                const toObject = {};
                const fromModel = getValueByPath(fromObject, [
                    'model'
                ]);
                if (fromModel != null) setValueByPath(toObject, [
                    '_url',
                    'name'
                ], tModel(apiClient, fromModel));
                return toObject;
            }
            function deleteModelParametersToVertex(apiClient, fromObject) {
                const toObject = {};
                const fromModel = getValueByPath(fromObject, [
                    'model'
                ]);
                if (fromModel != null) setValueByPath(toObject, [
                    '_url',
                    'name'
                ], tModel(apiClient, fromModel));
                return toObject;
            }
            function deleteModelResponseFromMldev(fromObject) {
                const toObject = {};
                const fromSdkHttpResponse = getValueByPath(fromObject, [
                    'sdkHttpResponse'
                ]);
                if (fromSdkHttpResponse != null) setValueByPath(toObject, [
                    'sdkHttpResponse'
                ], fromSdkHttpResponse);
                return toObject;
            }
            function deleteModelResponseFromVertex(fromObject) {
                const toObject = {};
                const fromSdkHttpResponse = getValueByPath(fromObject, [
                    'sdkHttpResponse'
                ]);
                if (fromSdkHttpResponse != null) setValueByPath(toObject, [
                    'sdkHttpResponse'
                ], fromSdkHttpResponse);
                return toObject;
            }
            function editImageConfigToVertex(fromObject, parentObject) {
                const toObject = {};
                const fromOutputGcsUri = getValueByPath(fromObject, [
                    'outputGcsUri'
                ]);
                if (parentObject !== undefined && fromOutputGcsUri != null) setValueByPath(parentObject, [
                    'parameters',
                    'storageUri'
                ], fromOutputGcsUri);
                const fromNegativePrompt = getValueByPath(fromObject, [
                    'negativePrompt'
                ]);
                if (parentObject !== undefined && fromNegativePrompt != null) setValueByPath(parentObject, [
                    'parameters',
                    'negativePrompt'
                ], fromNegativePrompt);
                const fromNumberOfImages = getValueByPath(fromObject, [
                    'numberOfImages'
                ]);
                if (parentObject !== undefined && fromNumberOfImages != null) setValueByPath(parentObject, [
                    'parameters',
                    'sampleCount'
                ], fromNumberOfImages);
                const fromAspectRatio = getValueByPath(fromObject, [
                    'aspectRatio'
                ]);
                if (parentObject !== undefined && fromAspectRatio != null) setValueByPath(parentObject, [
                    'parameters',
                    'aspectRatio'
                ], fromAspectRatio);
                const fromGuidanceScale = getValueByPath(fromObject, [
                    'guidanceScale'
                ]);
                if (parentObject !== undefined && fromGuidanceScale != null) setValueByPath(parentObject, [
                    'parameters',
                    'guidanceScale'
                ], fromGuidanceScale);
                const fromSeed = getValueByPath(fromObject, [
                    'seed'
                ]);
                if (parentObject !== undefined && fromSeed != null) setValueByPath(parentObject, [
                    'parameters',
                    'seed'
                ], fromSeed);
                const fromSafetyFilterLevel = getValueByPath(fromObject, [
                    'safetyFilterLevel'
                ]);
                if (parentObject !== undefined && fromSafetyFilterLevel != null) setValueByPath(parentObject, [
                    'parameters',
                    'safetySetting'
                ], fromSafetyFilterLevel);
                const fromPersonGeneration = getValueByPath(fromObject, [
                    'personGeneration'
                ]);
                if (parentObject !== undefined && fromPersonGeneration != null) setValueByPath(parentObject, [
                    'parameters',
                    'personGeneration'
                ], fromPersonGeneration);
                const fromIncludeSafetyAttributes = getValueByPath(fromObject, [
                    'includeSafetyAttributes'
                ]);
                if (parentObject !== undefined && fromIncludeSafetyAttributes != null) setValueByPath(parentObject, [
                    'parameters',
                    'includeSafetyAttributes'
                ], fromIncludeSafetyAttributes);
                const fromIncludeRaiReason = getValueByPath(fromObject, [
                    'includeRaiReason'
                ]);
                if (parentObject !== undefined && fromIncludeRaiReason != null) setValueByPath(parentObject, [
                    'parameters',
                    'includeRaiReason'
                ], fromIncludeRaiReason);
                const fromLanguage = getValueByPath(fromObject, [
                    'language'
                ]);
                if (parentObject !== undefined && fromLanguage != null) setValueByPath(parentObject, [
                    'parameters',
                    'language'
                ], fromLanguage);
                const fromOutputMimeType = getValueByPath(fromObject, [
                    'outputMimeType'
                ]);
                if (parentObject !== undefined && fromOutputMimeType != null) setValueByPath(parentObject, [
                    'parameters',
                    'outputOptions',
                    'mimeType'
                ], fromOutputMimeType);
                const fromOutputCompressionQuality = getValueByPath(fromObject, [
                    'outputCompressionQuality'
                ]);
                if (parentObject !== undefined && fromOutputCompressionQuality != null) setValueByPath(parentObject, [
                    'parameters',
                    'outputOptions',
                    'compressionQuality'
                ], fromOutputCompressionQuality);
                const fromAddWatermark = getValueByPath(fromObject, [
                    'addWatermark'
                ]);
                if (parentObject !== undefined && fromAddWatermark != null) setValueByPath(parentObject, [
                    'parameters',
                    'addWatermark'
                ], fromAddWatermark);
                const fromLabels = getValueByPath(fromObject, [
                    'labels'
                ]);
                if (parentObject !== undefined && fromLabels != null) setValueByPath(parentObject, [
                    'labels'
                ], fromLabels);
                const fromEditMode = getValueByPath(fromObject, [
                    'editMode'
                ]);
                if (parentObject !== undefined && fromEditMode != null) setValueByPath(parentObject, [
                    'parameters',
                    'editMode'
                ], fromEditMode);
                const fromBaseSteps = getValueByPath(fromObject, [
                    'baseSteps'
                ]);
                if (parentObject !== undefined && fromBaseSteps != null) setValueByPath(parentObject, [
                    'parameters',
                    'editConfig',
                    'baseSteps'
                ], fromBaseSteps);
                return toObject;
            }
            function editImageParametersInternalToVertex(apiClient, fromObject) {
                const toObject = {};
                const fromModel = getValueByPath(fromObject, [
                    'model'
                ]);
                if (fromModel != null) setValueByPath(toObject, [
                    '_url',
                    'model'
                ], tModel(apiClient, fromModel));
                const fromPrompt = getValueByPath(fromObject, [
                    'prompt'
                ]);
                if (fromPrompt != null) setValueByPath(toObject, [
                    'instances[0]',
                    'prompt'
                ], fromPrompt);
                const fromReferenceImages = getValueByPath(fromObject, [
                    'referenceImages'
                ]);
                if (fromReferenceImages != null) {
                    let transformedList = fromReferenceImages;
                    if (Array.isArray(transformedList)) transformedList = transformedList.map((item)=>{
                        return referenceImageAPIInternalToVertex(item);
                    });
                    setValueByPath(toObject, [
                        'instances[0]',
                        'referenceImages'
                    ], transformedList);
                }
                const fromConfig = getValueByPath(fromObject, [
                    'config'
                ]);
                if (fromConfig != null) editImageConfigToVertex(fromConfig, toObject);
                return toObject;
            }
            function editImageResponseFromVertex(fromObject) {
                const toObject = {};
                const fromSdkHttpResponse = getValueByPath(fromObject, [
                    'sdkHttpResponse'
                ]);
                if (fromSdkHttpResponse != null) setValueByPath(toObject, [
                    'sdkHttpResponse'
                ], fromSdkHttpResponse);
                const fromGeneratedImages = getValueByPath(fromObject, [
                    'predictions'
                ]);
                if (fromGeneratedImages != null) {
                    let transformedList = fromGeneratedImages;
                    if (Array.isArray(transformedList)) transformedList = transformedList.map((item)=>{
                        return generatedImageFromVertex(item);
                    });
                    setValueByPath(toObject, [
                        'generatedImages'
                    ], transformedList);
                }
                return toObject;
            }
            function embedContentConfigToMldev(fromObject, parentObject) {
                const toObject = {};
                const fromTaskType = getValueByPath(fromObject, [
                    'taskType'
                ]);
                if (parentObject !== undefined && fromTaskType != null) setValueByPath(parentObject, [
                    'requests[]',
                    'taskType'
                ], fromTaskType);
                const fromTitle = getValueByPath(fromObject, [
                    'title'
                ]);
                if (parentObject !== undefined && fromTitle != null) setValueByPath(parentObject, [
                    'requests[]',
                    'title'
                ], fromTitle);
                const fromOutputDimensionality = getValueByPath(fromObject, [
                    'outputDimensionality'
                ]);
                if (parentObject !== undefined && fromOutputDimensionality != null) setValueByPath(parentObject, [
                    'requests[]',
                    'outputDimensionality'
                ], fromOutputDimensionality);
                if (getValueByPath(fromObject, [
                    'mimeType'
                ]) !== undefined) throw new Error('mimeType parameter is not supported in Gemini API.');
                if (getValueByPath(fromObject, [
                    'autoTruncate'
                ]) !== undefined) throw new Error('autoTruncate parameter is not supported in Gemini API.');
                return toObject;
            }
            function embedContentConfigToVertex(fromObject, parentObject) {
                const toObject = {};
                const fromTaskType = getValueByPath(fromObject, [
                    'taskType'
                ]);
                if (parentObject !== undefined && fromTaskType != null) setValueByPath(parentObject, [
                    'instances[]',
                    'task_type'
                ], fromTaskType);
                const fromTitle = getValueByPath(fromObject, [
                    'title'
                ]);
                if (parentObject !== undefined && fromTitle != null) setValueByPath(parentObject, [
                    'instances[]',
                    'title'
                ], fromTitle);
                const fromOutputDimensionality = getValueByPath(fromObject, [
                    'outputDimensionality'
                ]);
                if (parentObject !== undefined && fromOutputDimensionality != null) setValueByPath(parentObject, [
                    'parameters',
                    'outputDimensionality'
                ], fromOutputDimensionality);
                const fromMimeType = getValueByPath(fromObject, [
                    'mimeType'
                ]);
                if (parentObject !== undefined && fromMimeType != null) setValueByPath(parentObject, [
                    'instances[]',
                    'mimeType'
                ], fromMimeType);
                const fromAutoTruncate = getValueByPath(fromObject, [
                    'autoTruncate'
                ]);
                if (parentObject !== undefined && fromAutoTruncate != null) setValueByPath(parentObject, [
                    'parameters',
                    'autoTruncate'
                ], fromAutoTruncate);
                return toObject;
            }
            function embedContentParametersToMldev(apiClient, fromObject) {
                const toObject = {};
                const fromModel = getValueByPath(fromObject, [
                    'model'
                ]);
                if (fromModel != null) setValueByPath(toObject, [
                    '_url',
                    'model'
                ], tModel(apiClient, fromModel));
                const fromContents = getValueByPath(fromObject, [
                    'contents'
                ]);
                if (fromContents != null) {
                    let transformedList = tContentsForEmbed(apiClient, fromContents);
                    if (Array.isArray(transformedList)) transformedList = transformedList.map((item)=>{
                        return item;
                    });
                    setValueByPath(toObject, [
                        'requests[]',
                        'content'
                    ], transformedList);
                }
                const fromConfig = getValueByPath(fromObject, [
                    'config'
                ]);
                if (fromConfig != null) embedContentConfigToMldev(fromConfig, toObject);
                const fromModelForEmbedContent = getValueByPath(fromObject, [
                    'model'
                ]);
                if (fromModelForEmbedContent !== undefined) setValueByPath(toObject, [
                    'requests[]',
                    'model'
                ], tModel(apiClient, fromModelForEmbedContent));
                return toObject;
            }
            function embedContentParametersToVertex(apiClient, fromObject) {
                const toObject = {};
                const fromModel = getValueByPath(fromObject, [
                    'model'
                ]);
                if (fromModel != null) setValueByPath(toObject, [
                    '_url',
                    'model'
                ], tModel(apiClient, fromModel));
                const fromContents = getValueByPath(fromObject, [
                    'contents'
                ]);
                if (fromContents != null) {
                    let transformedList = tContentsForEmbed(apiClient, fromContents);
                    if (Array.isArray(transformedList)) transformedList = transformedList.map((item)=>{
                        return item;
                    });
                    setValueByPath(toObject, [
                        'instances[]',
                        'content'
                    ], transformedList);
                }
                const fromConfig = getValueByPath(fromObject, [
                    'config'
                ]);
                if (fromConfig != null) embedContentConfigToVertex(fromConfig, toObject);
                return toObject;
            }
            function embedContentResponseFromMldev(fromObject) {
                const toObject = {};
                const fromSdkHttpResponse = getValueByPath(fromObject, [
                    'sdkHttpResponse'
                ]);
                if (fromSdkHttpResponse != null) setValueByPath(toObject, [
                    'sdkHttpResponse'
                ], fromSdkHttpResponse);
                const fromEmbeddings = getValueByPath(fromObject, [
                    'embeddings'
                ]);
                if (fromEmbeddings != null) {
                    let transformedList = fromEmbeddings;
                    if (Array.isArray(transformedList)) transformedList = transformedList.map((item)=>{
                        return item;
                    });
                    setValueByPath(toObject, [
                        'embeddings'
                    ], transformedList);
                }
                const fromMetadata = getValueByPath(fromObject, [
                    'metadata'
                ]);
                if (fromMetadata != null) setValueByPath(toObject, [
                    'metadata'
                ], fromMetadata);
                return toObject;
            }
            function embedContentResponseFromVertex(fromObject) {
                const toObject = {};
                const fromSdkHttpResponse = getValueByPath(fromObject, [
                    'sdkHttpResponse'
                ]);
                if (fromSdkHttpResponse != null) setValueByPath(toObject, [
                    'sdkHttpResponse'
                ], fromSdkHttpResponse);
                const fromEmbeddings = getValueByPath(fromObject, [
                    'predictions[]',
                    'embeddings'
                ]);
                if (fromEmbeddings != null) {
                    let transformedList = fromEmbeddings;
                    if (Array.isArray(transformedList)) transformedList = transformedList.map((item)=>{
                        return contentEmbeddingFromVertex(item);
                    });
                    setValueByPath(toObject, [
                        'embeddings'
                    ], transformedList);
                }
                const fromMetadata = getValueByPath(fromObject, [
                    'metadata'
                ]);
                if (fromMetadata != null) setValueByPath(toObject, [
                    'metadata'
                ], fromMetadata);
                return toObject;
            }
            function endpointFromVertex(fromObject) {
                const toObject = {};
                const fromName = getValueByPath(fromObject, [
                    'endpoint'
                ]);
                if (fromName != null) setValueByPath(toObject, [
                    'name'
                ], fromName);
                const fromDeployedModelId = getValueByPath(fromObject, [
                    'deployedModelId'
                ]);
                if (fromDeployedModelId != null) setValueByPath(toObject, [
                    'deployedModelId'
                ], fromDeployedModelId);
                return toObject;
            }
            function fileDataToMldev$1(fromObject) {
                const toObject = {};
                if (getValueByPath(fromObject, [
                    'displayName'
                ]) !== undefined) throw new Error('displayName parameter is not supported in Gemini API.');
                const fromFileUri = getValueByPath(fromObject, [
                    'fileUri'
                ]);
                if (fromFileUri != null) setValueByPath(toObject, [
                    'fileUri'
                ], fromFileUri);
                const fromMimeType = getValueByPath(fromObject, [
                    'mimeType'
                ]);
                if (fromMimeType != null) setValueByPath(toObject, [
                    'mimeType'
                ], fromMimeType);
                return toObject;
            }
            function functionCallToMldev$1(fromObject) {
                const toObject = {};
                const fromId = getValueByPath(fromObject, [
                    'id'
                ]);
                if (fromId != null) setValueByPath(toObject, [
                    'id'
                ], fromId);
                const fromArgs = getValueByPath(fromObject, [
                    'args'
                ]);
                if (fromArgs != null) setValueByPath(toObject, [
                    'args'
                ], fromArgs);
                const fromName = getValueByPath(fromObject, [
                    'name'
                ]);
                if (fromName != null) setValueByPath(toObject, [
                    'name'
                ], fromName);
                if (getValueByPath(fromObject, [
                    'partialArgs'
                ]) !== undefined) throw new Error('partialArgs parameter is not supported in Gemini API.');
                if (getValueByPath(fromObject, [
                    'willContinue'
                ]) !== undefined) throw new Error('willContinue parameter is not supported in Gemini API.');
                return toObject;
            }
            function functionCallingConfigToMldev(fromObject) {
                const toObject = {};
                const fromMode = getValueByPath(fromObject, [
                    'mode'
                ]);
                if (fromMode != null) setValueByPath(toObject, [
                    'mode'
                ], fromMode);
                const fromAllowedFunctionNames = getValueByPath(fromObject, [
                    'allowedFunctionNames'
                ]);
                if (fromAllowedFunctionNames != null) setValueByPath(toObject, [
                    'allowedFunctionNames'
                ], fromAllowedFunctionNames);
                if (getValueByPath(fromObject, [
                    'streamFunctionCallArguments'
                ]) !== undefined) throw new Error('streamFunctionCallArguments parameter is not supported in Gemini API.');
                return toObject;
            }
            function functionDeclarationToVertex(fromObject) {
                const toObject = {};
                if (getValueByPath(fromObject, [
                    'behavior'
                ]) !== undefined) throw new Error('behavior parameter is not supported in Vertex AI.');
                const fromDescription = getValueByPath(fromObject, [
                    'description'
                ]);
                if (fromDescription != null) setValueByPath(toObject, [
                    'description'
                ], fromDescription);
                const fromName = getValueByPath(fromObject, [
                    'name'
                ]);
                if (fromName != null) setValueByPath(toObject, [
                    'name'
                ], fromName);
                const fromParameters = getValueByPath(fromObject, [
                    'parameters'
                ]);
                if (fromParameters != null) setValueByPath(toObject, [
                    'parameters'
                ], fromParameters);
                const fromParametersJsonSchema = getValueByPath(fromObject, [
                    'parametersJsonSchema'
                ]);
                if (fromParametersJsonSchema != null) setValueByPath(toObject, [
                    'parametersJsonSchema'
                ], fromParametersJsonSchema);
                const fromResponse = getValueByPath(fromObject, [
                    'response'
                ]);
                if (fromResponse != null) setValueByPath(toObject, [
                    'response'
                ], fromResponse);
                const fromResponseJsonSchema = getValueByPath(fromObject, [
                    'responseJsonSchema'
                ]);
                if (fromResponseJsonSchema != null) setValueByPath(toObject, [
                    'responseJsonSchema'
                ], fromResponseJsonSchema);
                return toObject;
            }
            function generateContentConfigToMldev(apiClient, fromObject, parentObject) {
                const toObject = {};
                const fromSystemInstruction = getValueByPath(fromObject, [
                    'systemInstruction'
                ]);
                if (parentObject !== undefined && fromSystemInstruction != null) setValueByPath(parentObject, [
                    'systemInstruction'
                ], contentToMldev$1(tContent(fromSystemInstruction)));
                const fromTemperature = getValueByPath(fromObject, [
                    'temperature'
                ]);
                if (fromTemperature != null) setValueByPath(toObject, [
                    'temperature'
                ], fromTemperature);
                const fromTopP = getValueByPath(fromObject, [
                    'topP'
                ]);
                if (fromTopP != null) setValueByPath(toObject, [
                    'topP'
                ], fromTopP);
                const fromTopK = getValueByPath(fromObject, [
                    'topK'
                ]);
                if (fromTopK != null) setValueByPath(toObject, [
                    'topK'
                ], fromTopK);
                const fromCandidateCount = getValueByPath(fromObject, [
                    'candidateCount'
                ]);
                if (fromCandidateCount != null) setValueByPath(toObject, [
                    'candidateCount'
                ], fromCandidateCount);
                const fromMaxOutputTokens = getValueByPath(fromObject, [
                    'maxOutputTokens'
                ]);
                if (fromMaxOutputTokens != null) setValueByPath(toObject, [
                    'maxOutputTokens'
                ], fromMaxOutputTokens);
                const fromStopSequences = getValueByPath(fromObject, [
                    'stopSequences'
                ]);
                if (fromStopSequences != null) setValueByPath(toObject, [
                    'stopSequences'
                ], fromStopSequences);
                const fromResponseLogprobs = getValueByPath(fromObject, [
                    'responseLogprobs'
                ]);
                if (fromResponseLogprobs != null) setValueByPath(toObject, [
                    'responseLogprobs'
                ], fromResponseLogprobs);
                const fromLogprobs = getValueByPath(fromObject, [
                    'logprobs'
                ]);
                if (fromLogprobs != null) setValueByPath(toObject, [
                    'logprobs'
                ], fromLogprobs);
                const fromPresencePenalty = getValueByPath(fromObject, [
                    'presencePenalty'
                ]);
                if (fromPresencePenalty != null) setValueByPath(toObject, [
                    'presencePenalty'
                ], fromPresencePenalty);
                const fromFrequencyPenalty = getValueByPath(fromObject, [
                    'frequencyPenalty'
                ]);
                if (fromFrequencyPenalty != null) setValueByPath(toObject, [
                    'frequencyPenalty'
                ], fromFrequencyPenalty);
                const fromSeed = getValueByPath(fromObject, [
                    'seed'
                ]);
                if (fromSeed != null) setValueByPath(toObject, [
                    'seed'
                ], fromSeed);
                const fromResponseMimeType = getValueByPath(fromObject, [
                    'responseMimeType'
                ]);
                if (fromResponseMimeType != null) setValueByPath(toObject, [
                    'responseMimeType'
                ], fromResponseMimeType);
                const fromResponseSchema = getValueByPath(fromObject, [
                    'responseSchema'
                ]);
                if (fromResponseSchema != null) setValueByPath(toObject, [
                    'responseSchema'
                ], tSchema(fromResponseSchema));
                const fromResponseJsonSchema = getValueByPath(fromObject, [
                    'responseJsonSchema'
                ]);
                if (fromResponseJsonSchema != null) setValueByPath(toObject, [
                    'responseJsonSchema'
                ], fromResponseJsonSchema);
                if (getValueByPath(fromObject, [
                    'routingConfig'
                ]) !== undefined) throw new Error('routingConfig parameter is not supported in Gemini API.');
                if (getValueByPath(fromObject, [
                    'modelSelectionConfig'
                ]) !== undefined) throw new Error('modelSelectionConfig parameter is not supported in Gemini API.');
                const fromSafetySettings = getValueByPath(fromObject, [
                    'safetySettings'
                ]);
                if (parentObject !== undefined && fromSafetySettings != null) {
                    let transformedList = fromSafetySettings;
                    if (Array.isArray(transformedList)) transformedList = transformedList.map((item)=>{
                        return safetySettingToMldev(item);
                    });
                    setValueByPath(parentObject, [
                        'safetySettings'
                    ], transformedList);
                }
                const fromTools = getValueByPath(fromObject, [
                    'tools'
                ]);
                if (parentObject !== undefined && fromTools != null) {
                    let transformedList = tTools(fromTools);
                    if (Array.isArray(transformedList)) transformedList = transformedList.map((item)=>{
                        return toolToMldev$1(tTool(item));
                    });
                    setValueByPath(parentObject, [
                        'tools'
                    ], transformedList);
                }
                const fromToolConfig = getValueByPath(fromObject, [
                    'toolConfig'
                ]);
                if (parentObject !== undefined && fromToolConfig != null) setValueByPath(parentObject, [
                    'toolConfig'
                ], toolConfigToMldev(fromToolConfig));
                if (getValueByPath(fromObject, [
                    'labels'
                ]) !== undefined) throw new Error('labels parameter is not supported in Gemini API.');
                const fromCachedContent = getValueByPath(fromObject, [
                    'cachedContent'
                ]);
                if (parentObject !== undefined && fromCachedContent != null) setValueByPath(parentObject, [
                    'cachedContent'
                ], tCachedContentName(apiClient, fromCachedContent));
                const fromResponseModalities = getValueByPath(fromObject, [
                    'responseModalities'
                ]);
                if (fromResponseModalities != null) setValueByPath(toObject, [
                    'responseModalities'
                ], fromResponseModalities);
                const fromMediaResolution = getValueByPath(fromObject, [
                    'mediaResolution'
                ]);
                if (fromMediaResolution != null) setValueByPath(toObject, [
                    'mediaResolution'
                ], fromMediaResolution);
                const fromSpeechConfig = getValueByPath(fromObject, [
                    'speechConfig'
                ]);
                if (fromSpeechConfig != null) setValueByPath(toObject, [
                    'speechConfig'
                ], tSpeechConfig(fromSpeechConfig));
                if (getValueByPath(fromObject, [
                    'audioTimestamp'
                ]) !== undefined) throw new Error('audioTimestamp parameter is not supported in Gemini API.');
                const fromThinkingConfig = getValueByPath(fromObject, [
                    'thinkingConfig'
                ]);
                if (fromThinkingConfig != null) setValueByPath(toObject, [
                    'thinkingConfig'
                ], fromThinkingConfig);
                const fromImageConfig = getValueByPath(fromObject, [
                    'imageConfig'
                ]);
                if (fromImageConfig != null) setValueByPath(toObject, [
                    'imageConfig'
                ], imageConfigToMldev(fromImageConfig));
                const fromEnableEnhancedCivicAnswers = getValueByPath(fromObject, [
                    'enableEnhancedCivicAnswers'
                ]);
                if (fromEnableEnhancedCivicAnswers != null) setValueByPath(toObject, [
                    'enableEnhancedCivicAnswers'
                ], fromEnableEnhancedCivicAnswers);
                return toObject;
            }
            function generateContentConfigToVertex(apiClient, fromObject, parentObject) {
                const toObject = {};
                const fromSystemInstruction = getValueByPath(fromObject, [
                    'systemInstruction'
                ]);
                if (parentObject !== undefined && fromSystemInstruction != null) setValueByPath(parentObject, [
                    'systemInstruction'
                ], tContent(fromSystemInstruction));
                const fromTemperature = getValueByPath(fromObject, [
                    'temperature'
                ]);
                if (fromTemperature != null) setValueByPath(toObject, [
                    'temperature'
                ], fromTemperature);
                const fromTopP = getValueByPath(fromObject, [
                    'topP'
                ]);
                if (fromTopP != null) setValueByPath(toObject, [
                    'topP'
                ], fromTopP);
                const fromTopK = getValueByPath(fromObject, [
                    'topK'
                ]);
                if (fromTopK != null) setValueByPath(toObject, [
                    'topK'
                ], fromTopK);
                const fromCandidateCount = getValueByPath(fromObject, [
                    'candidateCount'
                ]);
                if (fromCandidateCount != null) setValueByPath(toObject, [
                    'candidateCount'
                ], fromCandidateCount);
                const fromMaxOutputTokens = getValueByPath(fromObject, [
                    'maxOutputTokens'
                ]);
                if (fromMaxOutputTokens != null) setValueByPath(toObject, [
                    'maxOutputTokens'
                ], fromMaxOutputTokens);
                const fromStopSequences = getValueByPath(fromObject, [
                    'stopSequences'
                ]);
                if (fromStopSequences != null) setValueByPath(toObject, [
                    'stopSequences'
                ], fromStopSequences);
                const fromResponseLogprobs = getValueByPath(fromObject, [
                    'responseLogprobs'
                ]);
                if (fromResponseLogprobs != null) setValueByPath(toObject, [
                    'responseLogprobs'
                ], fromResponseLogprobs);
                const fromLogprobs = getValueByPath(fromObject, [
                    'logprobs'
                ]);
                if (fromLogprobs != null) setValueByPath(toObject, [
                    'logprobs'
                ], fromLogprobs);
                const fromPresencePenalty = getValueByPath(fromObject, [
                    'presencePenalty'
                ]);
                if (fromPresencePenalty != null) setValueByPath(toObject, [
                    'presencePenalty'
                ], fromPresencePenalty);
                const fromFrequencyPenalty = getValueByPath(fromObject, [
                    'frequencyPenalty'
                ]);
                if (fromFrequencyPenalty != null) setValueByPath(toObject, [
                    'frequencyPenalty'
                ], fromFrequencyPenalty);
                const fromSeed = getValueByPath(fromObject, [
                    'seed'
                ]);
                if (fromSeed != null) setValueByPath(toObject, [
                    'seed'
                ], fromSeed);
                const fromResponseMimeType = getValueByPath(fromObject, [
                    'responseMimeType'
                ]);
                if (fromResponseMimeType != null) setValueByPath(toObject, [
                    'responseMimeType'
                ], fromResponseMimeType);
                const fromResponseSchema = getValueByPath(fromObject, [
                    'responseSchema'
                ]);
                if (fromResponseSchema != null) setValueByPath(toObject, [
                    'responseSchema'
                ], tSchema(fromResponseSchema));
                const fromResponseJsonSchema = getValueByPath(fromObject, [
                    'responseJsonSchema'
                ]);
                if (fromResponseJsonSchema != null) setValueByPath(toObject, [
                    'responseJsonSchema'
                ], fromResponseJsonSchema);
                const fromRoutingConfig = getValueByPath(fromObject, [
                    'routingConfig'
                ]);
                if (fromRoutingConfig != null) setValueByPath(toObject, [
                    'routingConfig'
                ], fromRoutingConfig);
                const fromModelSelectionConfig = getValueByPath(fromObject, [
                    'modelSelectionConfig'
                ]);
                if (fromModelSelectionConfig != null) setValueByPath(toObject, [
                    'modelConfig'
                ], fromModelSelectionConfig);
                const fromSafetySettings = getValueByPath(fromObject, [
                    'safetySettings'
                ]);
                if (parentObject !== undefined && fromSafetySettings != null) {
                    let transformedList = fromSafetySettings;
                    if (Array.isArray(transformedList)) transformedList = transformedList.map((item)=>{
                        return item;
                    });
                    setValueByPath(parentObject, [
                        'safetySettings'
                    ], transformedList);
                }
                const fromTools = getValueByPath(fromObject, [
                    'tools'
                ]);
                if (parentObject !== undefined && fromTools != null) {
                    let transformedList = tTools(fromTools);
                    if (Array.isArray(transformedList)) transformedList = transformedList.map((item)=>{
                        return toolToVertex(tTool(item));
                    });
                    setValueByPath(parentObject, [
                        'tools'
                    ], transformedList);
                }
                const fromToolConfig = getValueByPath(fromObject, [
                    'toolConfig'
                ]);
                if (parentObject !== undefined && fromToolConfig != null) setValueByPath(parentObject, [
                    'toolConfig'
                ], fromToolConfig);
                const fromLabels = getValueByPath(fromObject, [
                    'labels'
                ]);
                if (parentObject !== undefined && fromLabels != null) setValueByPath(parentObject, [
                    'labels'
                ], fromLabels);
                const fromCachedContent = getValueByPath(fromObject, [
                    'cachedContent'
                ]);
                if (parentObject !== undefined && fromCachedContent != null) setValueByPath(parentObject, [
                    'cachedContent'
                ], tCachedContentName(apiClient, fromCachedContent));
                const fromResponseModalities = getValueByPath(fromObject, [
                    'responseModalities'
                ]);
                if (fromResponseModalities != null) setValueByPath(toObject, [
                    'responseModalities'
                ], fromResponseModalities);
                const fromMediaResolution = getValueByPath(fromObject, [
                    'mediaResolution'
                ]);
                if (fromMediaResolution != null) setValueByPath(toObject, [
                    'mediaResolution'
                ], fromMediaResolution);
                const fromSpeechConfig = getValueByPath(fromObject, [
                    'speechConfig'
                ]);
                if (fromSpeechConfig != null) setValueByPath(toObject, [
                    'speechConfig'
                ], tSpeechConfig(fromSpeechConfig));
                const fromAudioTimestamp = getValueByPath(fromObject, [
                    'audioTimestamp'
                ]);
                if (fromAudioTimestamp != null) setValueByPath(toObject, [
                    'audioTimestamp'
                ], fromAudioTimestamp);
                const fromThinkingConfig = getValueByPath(fromObject, [
                    'thinkingConfig'
                ]);
                if (fromThinkingConfig != null) setValueByPath(toObject, [
                    'thinkingConfig'
                ], fromThinkingConfig);
                const fromImageConfig = getValueByPath(fromObject, [
                    'imageConfig'
                ]);
                if (fromImageConfig != null) setValueByPath(toObject, [
                    'imageConfig'
                ], imageConfigToVertex(fromImageConfig));
                if (getValueByPath(fromObject, [
                    'enableEnhancedCivicAnswers'
                ]) !== undefined) throw new Error('enableEnhancedCivicAnswers parameter is not supported in Vertex AI.');
                return toObject;
            }
            function generateContentParametersToMldev(apiClient, fromObject) {
                const toObject = {};
                const fromModel = getValueByPath(fromObject, [
                    'model'
                ]);
                if (fromModel != null) setValueByPath(toObject, [
                    '_url',
                    'model'
                ], tModel(apiClient, fromModel));
                const fromContents = getValueByPath(fromObject, [
                    'contents'
                ]);
                if (fromContents != null) {
                    let transformedList = tContents(fromContents);
                    if (Array.isArray(transformedList)) transformedList = transformedList.map((item)=>{
                        return contentToMldev$1(item);
                    });
                    setValueByPath(toObject, [
                        'contents'
                    ], transformedList);
                }
                const fromConfig = getValueByPath(fromObject, [
                    'config'
                ]);
                if (fromConfig != null) setValueByPath(toObject, [
                    'generationConfig'
                ], generateContentConfigToMldev(apiClient, fromConfig, toObject));
                return toObject;
            }
            function generateContentParametersToVertex(apiClient, fromObject) {
                const toObject = {};
                const fromModel = getValueByPath(fromObject, [
                    'model'
                ]);
                if (fromModel != null) setValueByPath(toObject, [
                    '_url',
                    'model'
                ], tModel(apiClient, fromModel));
                const fromContents = getValueByPath(fromObject, [
                    'contents'
                ]);
                if (fromContents != null) {
                    let transformedList = tContents(fromContents);
                    if (Array.isArray(transformedList)) transformedList = transformedList.map((item)=>{
                        return item;
                    });
                    setValueByPath(toObject, [
                        'contents'
                    ], transformedList);
                }
                const fromConfig = getValueByPath(fromObject, [
                    'config'
                ]);
                if (fromConfig != null) setValueByPath(toObject, [
                    'generationConfig'
                ], generateContentConfigToVertex(apiClient, fromConfig, toObject));
                return toObject;
            }
            function generateContentResponseFromMldev(fromObject) {
                const toObject = {};
                const fromSdkHttpResponse = getValueByPath(fromObject, [
                    'sdkHttpResponse'
                ]);
                if (fromSdkHttpResponse != null) setValueByPath(toObject, [
                    'sdkHttpResponse'
                ], fromSdkHttpResponse);
                const fromCandidates = getValueByPath(fromObject, [
                    'candidates'
                ]);
                if (fromCandidates != null) {
                    let transformedList = fromCandidates;
                    if (Array.isArray(transformedList)) transformedList = transformedList.map((item)=>{
                        return candidateFromMldev(item);
                    });
                    setValueByPath(toObject, [
                        'candidates'
                    ], transformedList);
                }
                const fromModelVersion = getValueByPath(fromObject, [
                    'modelVersion'
                ]);
                if (fromModelVersion != null) setValueByPath(toObject, [
                    'modelVersion'
                ], fromModelVersion);
                const fromPromptFeedback = getValueByPath(fromObject, [
                    'promptFeedback'
                ]);
                if (fromPromptFeedback != null) setValueByPath(toObject, [
                    'promptFeedback'
                ], fromPromptFeedback);
                const fromResponseId = getValueByPath(fromObject, [
                    'responseId'
                ]);
                if (fromResponseId != null) setValueByPath(toObject, [
                    'responseId'
                ], fromResponseId);
                const fromUsageMetadata = getValueByPath(fromObject, [
                    'usageMetadata'
                ]);
                if (fromUsageMetadata != null) setValueByPath(toObject, [
                    'usageMetadata'
                ], fromUsageMetadata);
                return toObject;
            }
            function generateContentResponseFromVertex(fromObject) {
                const toObject = {};
                const fromSdkHttpResponse = getValueByPath(fromObject, [
                    'sdkHttpResponse'
                ]);
                if (fromSdkHttpResponse != null) setValueByPath(toObject, [
                    'sdkHttpResponse'
                ], fromSdkHttpResponse);
                const fromCandidates = getValueByPath(fromObject, [
                    'candidates'
                ]);
                if (fromCandidates != null) {
                    let transformedList = fromCandidates;
                    if (Array.isArray(transformedList)) transformedList = transformedList.map((item)=>{
                        return item;
                    });
                    setValueByPath(toObject, [
                        'candidates'
                    ], transformedList);
                }
                const fromCreateTime = getValueByPath(fromObject, [
                    'createTime'
                ]);
                if (fromCreateTime != null) setValueByPath(toObject, [
                    'createTime'
                ], fromCreateTime);
                const fromModelVersion = getValueByPath(fromObject, [
                    'modelVersion'
                ]);
                if (fromModelVersion != null) setValueByPath(toObject, [
                    'modelVersion'
                ], fromModelVersion);
                const fromPromptFeedback = getValueByPath(fromObject, [
                    'promptFeedback'
                ]);
                if (fromPromptFeedback != null) setValueByPath(toObject, [
                    'promptFeedback'
                ], fromPromptFeedback);
                const fromResponseId = getValueByPath(fromObject, [
                    'responseId'
                ]);
                if (fromResponseId != null) setValueByPath(toObject, [
                    'responseId'
                ], fromResponseId);
                const fromUsageMetadata = getValueByPath(fromObject, [
                    'usageMetadata'
                ]);
                if (fromUsageMetadata != null) setValueByPath(toObject, [
                    'usageMetadata'
                ], fromUsageMetadata);
                return toObject;
            }
            function generateImagesConfigToMldev(fromObject, parentObject) {
                const toObject = {};
                if (getValueByPath(fromObject, [
                    'outputGcsUri'
                ]) !== undefined) throw new Error('outputGcsUri parameter is not supported in Gemini API.');
                if (getValueByPath(fromObject, [
                    'negativePrompt'
                ]) !== undefined) throw new Error('negativePrompt parameter is not supported in Gemini API.');
                const fromNumberOfImages = getValueByPath(fromObject, [
                    'numberOfImages'
                ]);
                if (parentObject !== undefined && fromNumberOfImages != null) setValueByPath(parentObject, [
                    'parameters',
                    'sampleCount'
                ], fromNumberOfImages);
                const fromAspectRatio = getValueByPath(fromObject, [
                    'aspectRatio'
                ]);
                if (parentObject !== undefined && fromAspectRatio != null) setValueByPath(parentObject, [
                    'parameters',
                    'aspectRatio'
                ], fromAspectRatio);
                const fromGuidanceScale = getValueByPath(fromObject, [
                    'guidanceScale'
                ]);
                if (parentObject !== undefined && fromGuidanceScale != null) setValueByPath(parentObject, [
                    'parameters',
                    'guidanceScale'
                ], fromGuidanceScale);
                if (getValueByPath(fromObject, [
                    'seed'
                ]) !== undefined) throw new Error('seed parameter is not supported in Gemini API.');
                const fromSafetyFilterLevel = getValueByPath(fromObject, [
                    'safetyFilterLevel'
                ]);
                if (parentObject !== undefined && fromSafetyFilterLevel != null) setValueByPath(parentObject, [
                    'parameters',
                    'safetySetting'
                ], fromSafetyFilterLevel);
                const fromPersonGeneration = getValueByPath(fromObject, [
                    'personGeneration'
                ]);
                if (parentObject !== undefined && fromPersonGeneration != null) setValueByPath(parentObject, [
                    'parameters',
                    'personGeneration'
                ], fromPersonGeneration);
                const fromIncludeSafetyAttributes = getValueByPath(fromObject, [
                    'includeSafetyAttributes'
                ]);
                if (parentObject !== undefined && fromIncludeSafetyAttributes != null) setValueByPath(parentObject, [
                    'parameters',
                    'includeSafetyAttributes'
                ], fromIncludeSafetyAttributes);
                const fromIncludeRaiReason = getValueByPath(fromObject, [
                    'includeRaiReason'
                ]);
                if (parentObject !== undefined && fromIncludeRaiReason != null) setValueByPath(parentObject, [
                    'parameters',
                    'includeRaiReason'
                ], fromIncludeRaiReason);
                const fromLanguage = getValueByPath(fromObject, [
                    'language'
                ]);
                if (parentObject !== undefined && fromLanguage != null) setValueByPath(parentObject, [
                    'parameters',
                    'language'
                ], fromLanguage);
                const fromOutputMimeType = getValueByPath(fromObject, [
                    'outputMimeType'
                ]);
                if (parentObject !== undefined && fromOutputMimeType != null) setValueByPath(parentObject, [
                    'parameters',
                    'outputOptions',
                    'mimeType'
                ], fromOutputMimeType);
                const fromOutputCompressionQuality = getValueByPath(fromObject, [
                    'outputCompressionQuality'
                ]);
                if (parentObject !== undefined && fromOutputCompressionQuality != null) setValueByPath(parentObject, [
                    'parameters',
                    'outputOptions',
                    'compressionQuality'
                ], fromOutputCompressionQuality);
                if (getValueByPath(fromObject, [
                    'addWatermark'
                ]) !== undefined) throw new Error('addWatermark parameter is not supported in Gemini API.');
                if (getValueByPath(fromObject, [
                    'labels'
                ]) !== undefined) throw new Error('labels parameter is not supported in Gemini API.');
                const fromImageSize = getValueByPath(fromObject, [
                    'imageSize'
                ]);
                if (parentObject !== undefined && fromImageSize != null) setValueByPath(parentObject, [
                    'parameters',
                    'sampleImageSize'
                ], fromImageSize);
                if (getValueByPath(fromObject, [
                    'enhancePrompt'
                ]) !== undefined) throw new Error('enhancePrompt parameter is not supported in Gemini API.');
                return toObject;
            }
            function generateImagesConfigToVertex(fromObject, parentObject) {
                const toObject = {};
                const fromOutputGcsUri = getValueByPath(fromObject, [
                    'outputGcsUri'
                ]);
                if (parentObject !== undefined && fromOutputGcsUri != null) setValueByPath(parentObject, [
                    'parameters',
                    'storageUri'
                ], fromOutputGcsUri);
                const fromNegativePrompt = getValueByPath(fromObject, [
                    'negativePrompt'
                ]);
                if (parentObject !== undefined && fromNegativePrompt != null) setValueByPath(parentObject, [
                    'parameters',
                    'negativePrompt'
                ], fromNegativePrompt);
                const fromNumberOfImages = getValueByPath(fromObject, [
                    'numberOfImages'
                ]);
                if (parentObject !== undefined && fromNumberOfImages != null) setValueByPath(parentObject, [
                    'parameters',
                    'sampleCount'
                ], fromNumberOfImages);
                const fromAspectRatio = getValueByPath(fromObject, [
                    'aspectRatio'
                ]);
                if (parentObject !== undefined && fromAspectRatio != null) setValueByPath(parentObject, [
                    'parameters',
                    'aspectRatio'
                ], fromAspectRatio);
                const fromGuidanceScale = getValueByPath(fromObject, [
                    'guidanceScale'
                ]);
                if (parentObject !== undefined && fromGuidanceScale != null) setValueByPath(parentObject, [
                    'parameters',
                    'guidanceScale'
                ], fromGuidanceScale);
                const fromSeed = getValueByPath(fromObject, [
                    'seed'
                ]);
                if (parentObject !== undefined && fromSeed != null) setValueByPath(parentObject, [
                    'parameters',
                    'seed'
                ], fromSeed);
                const fromSafetyFilterLevel = getValueByPath(fromObject, [
                    'safetyFilterLevel'
                ]);
                if (parentObject !== undefined && fromSafetyFilterLevel != null) setValueByPath(parentObject, [
                    'parameters',
                    'safetySetting'
                ], fromSafetyFilterLevel);
                const fromPersonGeneration = getValueByPath(fromObject, [
                    'personGeneration'
                ]);
                if (parentObject !== undefined && fromPersonGeneration != null) setValueByPath(parentObject, [
                    'parameters',
                    'personGeneration'
                ], fromPersonGeneration);
                const fromIncludeSafetyAttributes = getValueByPath(fromObject, [
                    'includeSafetyAttributes'
                ]);
                if (parentObject !== undefined && fromIncludeSafetyAttributes != null) setValueByPath(parentObject, [
                    'parameters',
                    'includeSafetyAttributes'
                ], fromIncludeSafetyAttributes);
                const fromIncludeRaiReason = getValueByPath(fromObject, [
                    'includeRaiReason'
                ]);
                if (parentObject !== undefined && fromIncludeRaiReason != null) setValueByPath(parentObject, [
                    'parameters',
                    'includeRaiReason'
                ], fromIncludeRaiReason);
                const fromLanguage = getValueByPath(fromObject, [
                    'language'
                ]);
                if (parentObject !== undefined && fromLanguage != null) setValueByPath(parentObject, [
                    'parameters',
                    'language'
                ], fromLanguage);
                const fromOutputMimeType = getValueByPath(fromObject, [
                    'outputMimeType'
                ]);
                if (parentObject !== undefined && fromOutputMimeType != null) setValueByPath(parentObject, [
                    'parameters',
                    'outputOptions',
                    'mimeType'
                ], fromOutputMimeType);
                const fromOutputCompressionQuality = getValueByPath(fromObject, [
                    'outputCompressionQuality'
                ]);
                if (parentObject !== undefined && fromOutputCompressionQuality != null) setValueByPath(parentObject, [
                    'parameters',
                    'outputOptions',
                    'compressionQuality'
                ], fromOutputCompressionQuality);
                const fromAddWatermark = getValueByPath(fromObject, [
                    'addWatermark'
                ]);
                if (parentObject !== undefined && fromAddWatermark != null) setValueByPath(parentObject, [
                    'parameters',
                    'addWatermark'
                ], fromAddWatermark);
                const fromLabels = getValueByPath(fromObject, [
                    'labels'
                ]);
                if (parentObject !== undefined && fromLabels != null) setValueByPath(parentObject, [
                    'labels'
                ], fromLabels);
                const fromImageSize = getValueByPath(fromObject, [
                    'imageSize'
                ]);
                if (parentObject !== undefined && fromImageSize != null) setValueByPath(parentObject, [
                    'parameters',
                    'sampleImageSize'
                ], fromImageSize);
                const fromEnhancePrompt = getValueByPath(fromObject, [
                    'enhancePrompt'
                ]);
                if (parentObject !== undefined && fromEnhancePrompt != null) setValueByPath(parentObject, [
                    'parameters',
                    'enhancePrompt'
                ], fromEnhancePrompt);
                return toObject;
            }
            function generateImagesParametersToMldev(apiClient, fromObject) {
                const toObject = {};
                const fromModel = getValueByPath(fromObject, [
                    'model'
                ]);
                if (fromModel != null) setValueByPath(toObject, [
                    '_url',
                    'model'
                ], tModel(apiClient, fromModel));
                const fromPrompt = getValueByPath(fromObject, [
                    'prompt'
                ]);
                if (fromPrompt != null) setValueByPath(toObject, [
                    'instances[0]',
                    'prompt'
                ], fromPrompt);
                const fromConfig = getValueByPath(fromObject, [
                    'config'
                ]);
                if (fromConfig != null) generateImagesConfigToMldev(fromConfig, toObject);
                return toObject;
            }
            function generateImagesParametersToVertex(apiClient, fromObject) {
                const toObject = {};
                const fromModel = getValueByPath(fromObject, [
                    'model'
                ]);
                if (fromModel != null) setValueByPath(toObject, [
                    '_url',
                    'model'
                ], tModel(apiClient, fromModel));
                const fromPrompt = getValueByPath(fromObject, [
                    'prompt'
                ]);
                if (fromPrompt != null) setValueByPath(toObject, [
                    'instances[0]',
                    'prompt'
                ], fromPrompt);
                const fromConfig = getValueByPath(fromObject, [
                    'config'
                ]);
                if (fromConfig != null) generateImagesConfigToVertex(fromConfig, toObject);
                return toObject;
            }
            function generateImagesResponseFromMldev(fromObject) {
                const toObject = {};
                const fromSdkHttpResponse = getValueByPath(fromObject, [
                    'sdkHttpResponse'
                ]);
                if (fromSdkHttpResponse != null) setValueByPath(toObject, [
                    'sdkHttpResponse'
                ], fromSdkHttpResponse);
                const fromGeneratedImages = getValueByPath(fromObject, [
                    'predictions'
                ]);
                if (fromGeneratedImages != null) {
                    let transformedList = fromGeneratedImages;
                    if (Array.isArray(transformedList)) transformedList = transformedList.map((item)=>{
                        return generatedImageFromMldev(item);
                    });
                    setValueByPath(toObject, [
                        'generatedImages'
                    ], transformedList);
                }
                const fromPositivePromptSafetyAttributes = getValueByPath(fromObject, [
                    'positivePromptSafetyAttributes'
                ]);
                if (fromPositivePromptSafetyAttributes != null) setValueByPath(toObject, [
                    'positivePromptSafetyAttributes'
                ], safetyAttributesFromMldev(fromPositivePromptSafetyAttributes));
                return toObject;
            }
            function generateImagesResponseFromVertex(fromObject) {
                const toObject = {};
                const fromSdkHttpResponse = getValueByPath(fromObject, [
                    'sdkHttpResponse'
                ]);
                if (fromSdkHttpResponse != null) setValueByPath(toObject, [
                    'sdkHttpResponse'
                ], fromSdkHttpResponse);
                const fromGeneratedImages = getValueByPath(fromObject, [
                    'predictions'
                ]);
                if (fromGeneratedImages != null) {
                    let transformedList = fromGeneratedImages;
                    if (Array.isArray(transformedList)) transformedList = transformedList.map((item)=>{
                        return generatedImageFromVertex(item);
                    });
                    setValueByPath(toObject, [
                        'generatedImages'
                    ], transformedList);
                }
                const fromPositivePromptSafetyAttributes = getValueByPath(fromObject, [
                    'positivePromptSafetyAttributes'
                ]);
                if (fromPositivePromptSafetyAttributes != null) setValueByPath(toObject, [
                    'positivePromptSafetyAttributes'
                ], safetyAttributesFromVertex(fromPositivePromptSafetyAttributes));
                return toObject;
            }
            function generateVideosConfigToMldev(fromObject, parentObject) {
                const toObject = {};
                const fromNumberOfVideos = getValueByPath(fromObject, [
                    'numberOfVideos'
                ]);
                if (parentObject !== undefined && fromNumberOfVideos != null) setValueByPath(parentObject, [
                    'parameters',
                    'sampleCount'
                ], fromNumberOfVideos);
                if (getValueByPath(fromObject, [
                    'outputGcsUri'
                ]) !== undefined) throw new Error('outputGcsUri parameter is not supported in Gemini API.');
                if (getValueByPath(fromObject, [
                    'fps'
                ]) !== undefined) throw new Error('fps parameter is not supported in Gemini API.');
                const fromDurationSeconds = getValueByPath(fromObject, [
                    'durationSeconds'
                ]);
                if (parentObject !== undefined && fromDurationSeconds != null) setValueByPath(parentObject, [
                    'parameters',
                    'durationSeconds'
                ], fromDurationSeconds);
                if (getValueByPath(fromObject, [
                    'seed'
                ]) !== undefined) throw new Error('seed parameter is not supported in Gemini API.');
                const fromAspectRatio = getValueByPath(fromObject, [
                    'aspectRatio'
                ]);
                if (parentObject !== undefined && fromAspectRatio != null) setValueByPath(parentObject, [
                    'parameters',
                    'aspectRatio'
                ], fromAspectRatio);
                const fromResolution = getValueByPath(fromObject, [
                    'resolution'
                ]);
                if (parentObject !== undefined && fromResolution != null) setValueByPath(parentObject, [
                    'parameters',
                    'resolution'
                ], fromResolution);
                const fromPersonGeneration = getValueByPath(fromObject, [
                    'personGeneration'
                ]);
                if (parentObject !== undefined && fromPersonGeneration != null) setValueByPath(parentObject, [
                    'parameters',
                    'personGeneration'
                ], fromPersonGeneration);
                if (getValueByPath(fromObject, [
                    'pubsubTopic'
                ]) !== undefined) throw new Error('pubsubTopic parameter is not supported in Gemini API.');
                const fromNegativePrompt = getValueByPath(fromObject, [
                    'negativePrompt'
                ]);
                if (parentObject !== undefined && fromNegativePrompt != null) setValueByPath(parentObject, [
                    'parameters',
                    'negativePrompt'
                ], fromNegativePrompt);
                const fromEnhancePrompt = getValueByPath(fromObject, [
                    'enhancePrompt'
                ]);
                if (parentObject !== undefined && fromEnhancePrompt != null) setValueByPath(parentObject, [
                    'parameters',
                    'enhancePrompt'
                ], fromEnhancePrompt);
                if (getValueByPath(fromObject, [
                    'generateAudio'
                ]) !== undefined) throw new Error('generateAudio parameter is not supported in Gemini API.');
                const fromLastFrame = getValueByPath(fromObject, [
                    'lastFrame'
                ]);
                if (parentObject !== undefined && fromLastFrame != null) setValueByPath(parentObject, [
                    'instances[0]',
                    'lastFrame'
                ], imageToMldev(fromLastFrame));
                const fromReferenceImages = getValueByPath(fromObject, [
                    'referenceImages'
                ]);
                if (parentObject !== undefined && fromReferenceImages != null) {
                    let transformedList = fromReferenceImages;
                    if (Array.isArray(transformedList)) transformedList = transformedList.map((item)=>{
                        return videoGenerationReferenceImageToMldev(item);
                    });
                    setValueByPath(parentObject, [
                        'instances[0]',
                        'referenceImages'
                    ], transformedList);
                }
                if (getValueByPath(fromObject, [
                    'mask'
                ]) !== undefined) throw new Error('mask parameter is not supported in Gemini API.');
                if (getValueByPath(fromObject, [
                    'compressionQuality'
                ]) !== undefined) throw new Error('compressionQuality parameter is not supported in Gemini API.');
                return toObject;
            }
            function generateVideosConfigToVertex(fromObject, parentObject) {
                const toObject = {};
                const fromNumberOfVideos = getValueByPath(fromObject, [
                    'numberOfVideos'
                ]);
                if (parentObject !== undefined && fromNumberOfVideos != null) setValueByPath(parentObject, [
                    'parameters',
                    'sampleCount'
                ], fromNumberOfVideos);
                const fromOutputGcsUri = getValueByPath(fromObject, [
                    'outputGcsUri'
                ]);
                if (parentObject !== undefined && fromOutputGcsUri != null) setValueByPath(parentObject, [
                    'parameters',
                    'storageUri'
                ], fromOutputGcsUri);
                const fromFps = getValueByPath(fromObject, [
                    'fps'
                ]);
                if (parentObject !== undefined && fromFps != null) setValueByPath(parentObject, [
                    'parameters',
                    'fps'
                ], fromFps);
                const fromDurationSeconds = getValueByPath(fromObject, [
                    'durationSeconds'
                ]);
                if (parentObject !== undefined && fromDurationSeconds != null) setValueByPath(parentObject, [
                    'parameters',
                    'durationSeconds'
                ], fromDurationSeconds);
                const fromSeed = getValueByPath(fromObject, [
                    'seed'
                ]);
                if (parentObject !== undefined && fromSeed != null) setValueByPath(parentObject, [
                    'parameters',
                    'seed'
                ], fromSeed);
                const fromAspectRatio = getValueByPath(fromObject, [
                    'aspectRatio'
                ]);
                if (parentObject !== undefined && fromAspectRatio != null) setValueByPath(parentObject, [
                    'parameters',
                    'aspectRatio'
                ], fromAspectRatio);
                const fromResolution = getValueByPath(fromObject, [
                    'resolution'
                ]);
                if (parentObject !== undefined && fromResolution != null) setValueByPath(parentObject, [
                    'parameters',
                    'resolution'
                ], fromResolution);
                const fromPersonGeneration = getValueByPath(fromObject, [
                    'personGeneration'
                ]);
                if (parentObject !== undefined && fromPersonGeneration != null) setValueByPath(parentObject, [
                    'parameters',
                    'personGeneration'
                ], fromPersonGeneration);
                const fromPubsubTopic = getValueByPath(fromObject, [
                    'pubsubTopic'
                ]);
                if (parentObject !== undefined && fromPubsubTopic != null) setValueByPath(parentObject, [
                    'parameters',
                    'pubsubTopic'
                ], fromPubsubTopic);
                const fromNegativePrompt = getValueByPath(fromObject, [
                    'negativePrompt'
                ]);
                if (parentObject !== undefined && fromNegativePrompt != null) setValueByPath(parentObject, [
                    'parameters',
                    'negativePrompt'
                ], fromNegativePrompt);
                const fromEnhancePrompt = getValueByPath(fromObject, [
                    'enhancePrompt'
                ]);
                if (parentObject !== undefined && fromEnhancePrompt != null) setValueByPath(parentObject, [
                    'parameters',
                    'enhancePrompt'
                ], fromEnhancePrompt);
                const fromGenerateAudio = getValueByPath(fromObject, [
                    'generateAudio'
                ]);
                if (parentObject !== undefined && fromGenerateAudio != null) setValueByPath(parentObject, [
                    'parameters',
                    'generateAudio'
                ], fromGenerateAudio);
                const fromLastFrame = getValueByPath(fromObject, [
                    'lastFrame'
                ]);
                if (parentObject !== undefined && fromLastFrame != null) setValueByPath(parentObject, [
                    'instances[0]',
                    'lastFrame'
                ], imageToVertex(fromLastFrame));
                const fromReferenceImages = getValueByPath(fromObject, [
                    'referenceImages'
                ]);
                if (parentObject !== undefined && fromReferenceImages != null) {
                    let transformedList = fromReferenceImages;
                    if (Array.isArray(transformedList)) transformedList = transformedList.map((item)=>{
                        return videoGenerationReferenceImageToVertex(item);
                    });
                    setValueByPath(parentObject, [
                        'instances[0]',
                        'referenceImages'
                    ], transformedList);
                }
                const fromMask = getValueByPath(fromObject, [
                    'mask'
                ]);
                if (parentObject !== undefined && fromMask != null) setValueByPath(parentObject, [
                    'instances[0]',
                    'mask'
                ], videoGenerationMaskToVertex(fromMask));
                const fromCompressionQuality = getValueByPath(fromObject, [
                    'compressionQuality'
                ]);
                if (parentObject !== undefined && fromCompressionQuality != null) setValueByPath(parentObject, [
                    'parameters',
                    'compressionQuality'
                ], fromCompressionQuality);
                return toObject;
            }
            function generateVideosOperationFromMldev(fromObject) {
                const toObject = {};
                const fromName = getValueByPath(fromObject, [
                    'name'
                ]);
                if (fromName != null) setValueByPath(toObject, [
                    'name'
                ], fromName);
                const fromMetadata = getValueByPath(fromObject, [
                    'metadata'
                ]);
                if (fromMetadata != null) setValueByPath(toObject, [
                    'metadata'
                ], fromMetadata);
                const fromDone = getValueByPath(fromObject, [
                    'done'
                ]);
                if (fromDone != null) setValueByPath(toObject, [
                    'done'
                ], fromDone);
                const fromError = getValueByPath(fromObject, [
                    'error'
                ]);
                if (fromError != null) setValueByPath(toObject, [
                    'error'
                ], fromError);
                const fromResponse = getValueByPath(fromObject, [
                    'response',
                    'generateVideoResponse'
                ]);
                if (fromResponse != null) setValueByPath(toObject, [
                    'response'
                ], generateVideosResponseFromMldev(fromResponse));
                return toObject;
            }
            function generateVideosOperationFromVertex(fromObject) {
                const toObject = {};
                const fromName = getValueByPath(fromObject, [
                    'name'
                ]);
                if (fromName != null) setValueByPath(toObject, [
                    'name'
                ], fromName);
                const fromMetadata = getValueByPath(fromObject, [
                    'metadata'
                ]);
                if (fromMetadata != null) setValueByPath(toObject, [
                    'metadata'
                ], fromMetadata);
                const fromDone = getValueByPath(fromObject, [
                    'done'
                ]);
                if (fromDone != null) setValueByPath(toObject, [
                    'done'
                ], fromDone);
                const fromError = getValueByPath(fromObject, [
                    'error'
                ]);
                if (fromError != null) setValueByPath(toObject, [
                    'error'
                ], fromError);
                const fromResponse = getValueByPath(fromObject, [
                    'response'
                ]);
                if (fromResponse != null) setValueByPath(toObject, [
                    'response'
                ], generateVideosResponseFromVertex(fromResponse));
                return toObject;
            }
            function generateVideosParametersToMldev(apiClient, fromObject) {
                const toObject = {};
                const fromModel = getValueByPath(fromObject, [
                    'model'
                ]);
                if (fromModel != null) setValueByPath(toObject, [
                    '_url',
                    'model'
                ], tModel(apiClient, fromModel));
                const fromPrompt = getValueByPath(fromObject, [
                    'prompt'
                ]);
                if (fromPrompt != null) setValueByPath(toObject, [
                    'instances[0]',
                    'prompt'
                ], fromPrompt);
                const fromImage = getValueByPath(fromObject, [
                    'image'
                ]);
                if (fromImage != null) setValueByPath(toObject, [
                    'instances[0]',
                    'image'
                ], imageToMldev(fromImage));
                const fromVideo = getValueByPath(fromObject, [
                    'video'
                ]);
                if (fromVideo != null) setValueByPath(toObject, [
                    'instances[0]',
                    'video'
                ], videoToMldev(fromVideo));
                const fromSource = getValueByPath(fromObject, [
                    'source'
                ]);
                if (fromSource != null) generateVideosSourceToMldev(fromSource, toObject);
                const fromConfig = getValueByPath(fromObject, [
                    'config'
                ]);
                if (fromConfig != null) generateVideosConfigToMldev(fromConfig, toObject);
                return toObject;
            }
            function generateVideosParametersToVertex(apiClient, fromObject) {
                const toObject = {};
                const fromModel = getValueByPath(fromObject, [
                    'model'
                ]);
                if (fromModel != null) setValueByPath(toObject, [
                    '_url',
                    'model'
                ], tModel(apiClient, fromModel));
                const fromPrompt = getValueByPath(fromObject, [
                    'prompt'
                ]);
                if (fromPrompt != null) setValueByPath(toObject, [
                    'instances[0]',
                    'prompt'
                ], fromPrompt);
                const fromImage = getValueByPath(fromObject, [
                    'image'
                ]);
                if (fromImage != null) setValueByPath(toObject, [
                    'instances[0]',
                    'image'
                ], imageToVertex(fromImage));
                const fromVideo = getValueByPath(fromObject, [
                    'video'
                ]);
                if (fromVideo != null) setValueByPath(toObject, [
                    'instances[0]',
                    'video'
                ], videoToVertex(fromVideo));
                const fromSource = getValueByPath(fromObject, [
                    'source'
                ]);
                if (fromSource != null) generateVideosSourceToVertex(fromSource, toObject);
                const fromConfig = getValueByPath(fromObject, [
                    'config'
                ]);
                if (fromConfig != null) generateVideosConfigToVertex(fromConfig, toObject);
                return toObject;
            }
            function generateVideosResponseFromMldev(fromObject) {
                const toObject = {};
                const fromGeneratedVideos = getValueByPath(fromObject, [
                    'generatedSamples'
                ]);
                if (fromGeneratedVideos != null) {
                    let transformedList = fromGeneratedVideos;
                    if (Array.isArray(transformedList)) transformedList = transformedList.map((item)=>{
                        return generatedVideoFromMldev(item);
                    });
                    setValueByPath(toObject, [
                        'generatedVideos'
                    ], transformedList);
                }
                const fromRaiMediaFilteredCount = getValueByPath(fromObject, [
                    'raiMediaFilteredCount'
                ]);
                if (fromRaiMediaFilteredCount != null) setValueByPath(toObject, [
                    'raiMediaFilteredCount'
                ], fromRaiMediaFilteredCount);
                const fromRaiMediaFilteredReasons = getValueByPath(fromObject, [
                    'raiMediaFilteredReasons'
                ]);
                if (fromRaiMediaFilteredReasons != null) setValueByPath(toObject, [
                    'raiMediaFilteredReasons'
                ], fromRaiMediaFilteredReasons);
                return toObject;
            }
            function generateVideosResponseFromVertex(fromObject) {
                const toObject = {};
                const fromGeneratedVideos = getValueByPath(fromObject, [
                    'videos'
                ]);
                if (fromGeneratedVideos != null) {
                    let transformedList = fromGeneratedVideos;
                    if (Array.isArray(transformedList)) transformedList = transformedList.map((item)=>{
                        return generatedVideoFromVertex(item);
                    });
                    setValueByPath(toObject, [
                        'generatedVideos'
                    ], transformedList);
                }
                const fromRaiMediaFilteredCount = getValueByPath(fromObject, [
                    'raiMediaFilteredCount'
                ]);
                if (fromRaiMediaFilteredCount != null) setValueByPath(toObject, [
                    'raiMediaFilteredCount'
                ], fromRaiMediaFilteredCount);
                const fromRaiMediaFilteredReasons = getValueByPath(fromObject, [
                    'raiMediaFilteredReasons'
                ]);
                if (fromRaiMediaFilteredReasons != null) setValueByPath(toObject, [
                    'raiMediaFilteredReasons'
                ], fromRaiMediaFilteredReasons);
                return toObject;
            }
            function generateVideosSourceToMldev(fromObject, parentObject) {
                const toObject = {};
                const fromPrompt = getValueByPath(fromObject, [
                    'prompt'
                ]);
                if (parentObject !== undefined && fromPrompt != null) setValueByPath(parentObject, [
                    'instances[0]',
                    'prompt'
                ], fromPrompt);
                const fromImage = getValueByPath(fromObject, [
                    'image'
                ]);
                if (parentObject !== undefined && fromImage != null) setValueByPath(parentObject, [
                    'instances[0]',
                    'image'
                ], imageToMldev(fromImage));
                const fromVideo = getValueByPath(fromObject, [
                    'video'
                ]);
                if (parentObject !== undefined && fromVideo != null) setValueByPath(parentObject, [
                    'instances[0]',
                    'video'
                ], videoToMldev(fromVideo));
                return toObject;
            }
            function generateVideosSourceToVertex(fromObject, parentObject) {
                const toObject = {};
                const fromPrompt = getValueByPath(fromObject, [
                    'prompt'
                ]);
                if (parentObject !== undefined && fromPrompt != null) setValueByPath(parentObject, [
                    'instances[0]',
                    'prompt'
                ], fromPrompt);
                const fromImage = getValueByPath(fromObject, [
                    'image'
                ]);
                if (parentObject !== undefined && fromImage != null) setValueByPath(parentObject, [
                    'instances[0]',
                    'image'
                ], imageToVertex(fromImage));
                const fromVideo = getValueByPath(fromObject, [
                    'video'
                ]);
                if (parentObject !== undefined && fromVideo != null) setValueByPath(parentObject, [
                    'instances[0]',
                    'video'
                ], videoToVertex(fromVideo));
                return toObject;
            }
            function generatedImageFromMldev(fromObject) {
                const toObject = {};
                const fromImage = getValueByPath(fromObject, [
                    '_self'
                ]);
                if (fromImage != null) setValueByPath(toObject, [
                    'image'
                ], imageFromMldev(fromImage));
                const fromRaiFilteredReason = getValueByPath(fromObject, [
                    'raiFilteredReason'
                ]);
                if (fromRaiFilteredReason != null) setValueByPath(toObject, [
                    'raiFilteredReason'
                ], fromRaiFilteredReason);
                const fromSafetyAttributes = getValueByPath(fromObject, [
                    '_self'
                ]);
                if (fromSafetyAttributes != null) setValueByPath(toObject, [
                    'safetyAttributes'
                ], safetyAttributesFromMldev(fromSafetyAttributes));
                return toObject;
            }
            function generatedImageFromVertex(fromObject) {
                const toObject = {};
                const fromImage = getValueByPath(fromObject, [
                    '_self'
                ]);
                if (fromImage != null) setValueByPath(toObject, [
                    'image'
                ], imageFromVertex(fromImage));
                const fromRaiFilteredReason = getValueByPath(fromObject, [
                    'raiFilteredReason'
                ]);
                if (fromRaiFilteredReason != null) setValueByPath(toObject, [
                    'raiFilteredReason'
                ], fromRaiFilteredReason);
                const fromSafetyAttributes = getValueByPath(fromObject, [
                    '_self'
                ]);
                if (fromSafetyAttributes != null) setValueByPath(toObject, [
                    'safetyAttributes'
                ], safetyAttributesFromVertex(fromSafetyAttributes));
                const fromEnhancedPrompt = getValueByPath(fromObject, [
                    'prompt'
                ]);
                if (fromEnhancedPrompt != null) setValueByPath(toObject, [
                    'enhancedPrompt'
                ], fromEnhancedPrompt);
                return toObject;
            }
            function generatedImageMaskFromVertex(fromObject) {
                const toObject = {};
                const fromMask = getValueByPath(fromObject, [
                    '_self'
                ]);
                if (fromMask != null) setValueByPath(toObject, [
                    'mask'
                ], imageFromVertex(fromMask));
                const fromLabels = getValueByPath(fromObject, [
                    'labels'
                ]);
                if (fromLabels != null) {
                    let transformedList = fromLabels;
                    if (Array.isArray(transformedList)) transformedList = transformedList.map((item)=>{
                        return item;
                    });
                    setValueByPath(toObject, [
                        'labels'
                    ], transformedList);
                }
                return toObject;
            }
            function generatedVideoFromMldev(fromObject) {
                const toObject = {};
                const fromVideo = getValueByPath(fromObject, [
                    'video'
                ]);
                if (fromVideo != null) setValueByPath(toObject, [
                    'video'
                ], videoFromMldev(fromVideo));
                return toObject;
            }
            function generatedVideoFromVertex(fromObject) {
                const toObject = {};
                const fromVideo = getValueByPath(fromObject, [
                    '_self'
                ]);
                if (fromVideo != null) setValueByPath(toObject, [
                    'video'
                ], videoFromVertex(fromVideo));
                return toObject;
            }
            function generationConfigToVertex(fromObject) {
                const toObject = {};
                const fromModelSelectionConfig = getValueByPath(fromObject, [
                    'modelSelectionConfig'
                ]);
                if (fromModelSelectionConfig != null) setValueByPath(toObject, [
                    'modelConfig'
                ], fromModelSelectionConfig);
                const fromResponseJsonSchema = getValueByPath(fromObject, [
                    'responseJsonSchema'
                ]);
                if (fromResponseJsonSchema != null) setValueByPath(toObject, [
                    'responseJsonSchema'
                ], fromResponseJsonSchema);
                const fromAudioTimestamp = getValueByPath(fromObject, [
                    'audioTimestamp'
                ]);
                if (fromAudioTimestamp != null) setValueByPath(toObject, [
                    'audioTimestamp'
                ], fromAudioTimestamp);
                const fromCandidateCount = getValueByPath(fromObject, [
                    'candidateCount'
                ]);
                if (fromCandidateCount != null) setValueByPath(toObject, [
                    'candidateCount'
                ], fromCandidateCount);
                const fromEnableAffectiveDialog = getValueByPath(fromObject, [
                    'enableAffectiveDialog'
                ]);
                if (fromEnableAffectiveDialog != null) setValueByPath(toObject, [
                    'enableAffectiveDialog'
                ], fromEnableAffectiveDialog);
                const fromFrequencyPenalty = getValueByPath(fromObject, [
                    'frequencyPenalty'
                ]);
                if (fromFrequencyPenalty != null) setValueByPath(toObject, [
                    'frequencyPenalty'
                ], fromFrequencyPenalty);
                const fromLogprobs = getValueByPath(fromObject, [
                    'logprobs'
                ]);
                if (fromLogprobs != null) setValueByPath(toObject, [
                    'logprobs'
                ], fromLogprobs);
                const fromMaxOutputTokens = getValueByPath(fromObject, [
                    'maxOutputTokens'
                ]);
                if (fromMaxOutputTokens != null) setValueByPath(toObject, [
                    'maxOutputTokens'
                ], fromMaxOutputTokens);
                const fromMediaResolution = getValueByPath(fromObject, [
                    'mediaResolution'
                ]);
                if (fromMediaResolution != null) setValueByPath(toObject, [
                    'mediaResolution'
                ], fromMediaResolution);
                const fromPresencePenalty = getValueByPath(fromObject, [
                    'presencePenalty'
                ]);
                if (fromPresencePenalty != null) setValueByPath(toObject, [
                    'presencePenalty'
                ], fromPresencePenalty);
                const fromResponseLogprobs = getValueByPath(fromObject, [
                    'responseLogprobs'
                ]);
                if (fromResponseLogprobs != null) setValueByPath(toObject, [
                    'responseLogprobs'
                ], fromResponseLogprobs);
                const fromResponseMimeType = getValueByPath(fromObject, [
                    'responseMimeType'
                ]);
                if (fromResponseMimeType != null) setValueByPath(toObject, [
                    'responseMimeType'
                ], fromResponseMimeType);
                const fromResponseModalities = getValueByPath(fromObject, [
                    'responseModalities'
                ]);
                if (fromResponseModalities != null) setValueByPath(toObject, [
                    'responseModalities'
                ], fromResponseModalities);
                const fromResponseSchema = getValueByPath(fromObject, [
                    'responseSchema'
                ]);
                if (fromResponseSchema != null) setValueByPath(toObject, [
                    'responseSchema'
                ], fromResponseSchema);
                const fromRoutingConfig = getValueByPath(fromObject, [
                    'routingConfig'
                ]);
                if (fromRoutingConfig != null) setValueByPath(toObject, [
                    'routingConfig'
                ], fromRoutingConfig);
                const fromSeed = getValueByPath(fromObject, [
                    'seed'
                ]);
                if (fromSeed != null) setValueByPath(toObject, [
                    'seed'
                ], fromSeed);
                const fromSpeechConfig = getValueByPath(fromObject, [
                    'speechConfig'
                ]);
                if (fromSpeechConfig != null) setValueByPath(toObject, [
                    'speechConfig'
                ], fromSpeechConfig);
                const fromStopSequences = getValueByPath(fromObject, [
                    'stopSequences'
                ]);
                if (fromStopSequences != null) setValueByPath(toObject, [
                    'stopSequences'
                ], fromStopSequences);
                const fromTemperature = getValueByPath(fromObject, [
                    'temperature'
                ]);
                if (fromTemperature != null) setValueByPath(toObject, [
                    'temperature'
                ], fromTemperature);
                const fromThinkingConfig = getValueByPath(fromObject, [
                    'thinkingConfig'
                ]);
                if (fromThinkingConfig != null) setValueByPath(toObject, [
                    'thinkingConfig'
                ], fromThinkingConfig);
                const fromTopK = getValueByPath(fromObject, [
                    'topK'
                ]);
                if (fromTopK != null) setValueByPath(toObject, [
                    'topK'
                ], fromTopK);
                const fromTopP = getValueByPath(fromObject, [
                    'topP'
                ]);
                if (fromTopP != null) setValueByPath(toObject, [
                    'topP'
                ], fromTopP);
                if (getValueByPath(fromObject, [
                    'enableEnhancedCivicAnswers'
                ]) !== undefined) throw new Error('enableEnhancedCivicAnswers parameter is not supported in Vertex AI.');
                return toObject;
            }
            function getModelParametersToMldev(apiClient, fromObject) {
                const toObject = {};
                const fromModel = getValueByPath(fromObject, [
                    'model'
                ]);
                if (fromModel != null) setValueByPath(toObject, [
                    '_url',
                    'name'
                ], tModel(apiClient, fromModel));
                return toObject;
            }
            function getModelParametersToVertex(apiClient, fromObject) {
                const toObject = {};
                const fromModel = getValueByPath(fromObject, [
                    'model'
                ]);
                if (fromModel != null) setValueByPath(toObject, [
                    '_url',
                    'name'
                ], tModel(apiClient, fromModel));
                return toObject;
            }
            function googleMapsToMldev$1(fromObject) {
                const toObject = {};
                if (getValueByPath(fromObject, [
                    'authConfig'
                ]) !== undefined) throw new Error('authConfig parameter is not supported in Gemini API.');
                const fromEnableWidget = getValueByPath(fromObject, [
                    'enableWidget'
                ]);
                if (fromEnableWidget != null) setValueByPath(toObject, [
                    'enableWidget'
                ], fromEnableWidget);
                return toObject;
            }
            function googleSearchToMldev$1(fromObject) {
                const toObject = {};
                if (getValueByPath(fromObject, [
                    'excludeDomains'
                ]) !== undefined) throw new Error('excludeDomains parameter is not supported in Gemini API.');
                if (getValueByPath(fromObject, [
                    'blockingConfidence'
                ]) !== undefined) throw new Error('blockingConfidence parameter is not supported in Gemini API.');
                const fromTimeRangeFilter = getValueByPath(fromObject, [
                    'timeRangeFilter'
                ]);
                if (fromTimeRangeFilter != null) setValueByPath(toObject, [
                    'timeRangeFilter'
                ], fromTimeRangeFilter);
                return toObject;
            }
            function imageConfigToMldev(fromObject) {
                const toObject = {};
                const fromAspectRatio = getValueByPath(fromObject, [
                    'aspectRatio'
                ]);
                if (fromAspectRatio != null) setValueByPath(toObject, [
                    'aspectRatio'
                ], fromAspectRatio);
                const fromImageSize = getValueByPath(fromObject, [
                    'imageSize'
                ]);
                if (fromImageSize != null) setValueByPath(toObject, [
                    'imageSize'
                ], fromImageSize);
                if (getValueByPath(fromObject, [
                    'outputMimeType'
                ]) !== undefined) throw new Error('outputMimeType parameter is not supported in Gemini API.');
                if (getValueByPath(fromObject, [
                    'outputCompressionQuality'
                ]) !== undefined) throw new Error('outputCompressionQuality parameter is not supported in Gemini API.');
                return toObject;
            }
            function imageConfigToVertex(fromObject) {
                const toObject = {};
                const fromAspectRatio = getValueByPath(fromObject, [
                    'aspectRatio'
                ]);
                if (fromAspectRatio != null) setValueByPath(toObject, [
                    'aspectRatio'
                ], fromAspectRatio);
                const fromImageSize = getValueByPath(fromObject, [
                    'imageSize'
                ]);
                if (fromImageSize != null) setValueByPath(toObject, [
                    'imageSize'
                ], fromImageSize);
                const fromOutputMimeType = getValueByPath(fromObject, [
                    'outputMimeType'
                ]);
                if (fromOutputMimeType != null) setValueByPath(toObject, [
                    'imageOutputOptions',
                    'mimeType'
                ], fromOutputMimeType);
                const fromOutputCompressionQuality = getValueByPath(fromObject, [
                    'outputCompressionQuality'
                ]);
                if (fromOutputCompressionQuality != null) setValueByPath(toObject, [
                    'imageOutputOptions',
                    'compressionQuality'
                ], fromOutputCompressionQuality);
                return toObject;
            }
            function imageFromMldev(fromObject) {
                const toObject = {};
                const fromImageBytes = getValueByPath(fromObject, [
                    'bytesBase64Encoded'
                ]);
                if (fromImageBytes != null) setValueByPath(toObject, [
                    'imageBytes'
                ], tBytes(fromImageBytes));
                const fromMimeType = getValueByPath(fromObject, [
                    'mimeType'
                ]);
                if (fromMimeType != null) setValueByPath(toObject, [
                    'mimeType'
                ], fromMimeType);
                return toObject;
            }
            function imageFromVertex(fromObject) {
                const toObject = {};
                const fromGcsUri = getValueByPath(fromObject, [
                    'gcsUri'
                ]);
                if (fromGcsUri != null) setValueByPath(toObject, [
                    'gcsUri'
                ], fromGcsUri);
                const fromImageBytes = getValueByPath(fromObject, [
                    'bytesBase64Encoded'
                ]);
                if (fromImageBytes != null) setValueByPath(toObject, [
                    'imageBytes'
                ], tBytes(fromImageBytes));
                const fromMimeType = getValueByPath(fromObject, [
                    'mimeType'
                ]);
                if (fromMimeType != null) setValueByPath(toObject, [
                    'mimeType'
                ], fromMimeType);
                return toObject;
            }
            function imageToMldev(fromObject) {
                const toObject = {};
                if (getValueByPath(fromObject, [
                    'gcsUri'
                ]) !== undefined) throw new Error('gcsUri parameter is not supported in Gemini API.');
                const fromImageBytes = getValueByPath(fromObject, [
                    'imageBytes'
                ]);
                if (fromImageBytes != null) setValueByPath(toObject, [
                    'bytesBase64Encoded'
                ], tBytes(fromImageBytes));
                const fromMimeType = getValueByPath(fromObject, [
                    'mimeType'
                ]);
                if (fromMimeType != null) setValueByPath(toObject, [
                    'mimeType'
                ], fromMimeType);
                return toObject;
            }
            function imageToVertex(fromObject) {
                const toObject = {};
                const fromGcsUri = getValueByPath(fromObject, [
                    'gcsUri'
                ]);
                if (fromGcsUri != null) setValueByPath(toObject, [
                    'gcsUri'
                ], fromGcsUri);
                const fromImageBytes = getValueByPath(fromObject, [
                    'imageBytes'
                ]);
                if (fromImageBytes != null) setValueByPath(toObject, [
                    'bytesBase64Encoded'
                ], tBytes(fromImageBytes));
                const fromMimeType = getValueByPath(fromObject, [
                    'mimeType'
                ]);
                if (fromMimeType != null) setValueByPath(toObject, [
                    'mimeType'
                ], fromMimeType);
                return toObject;
            }
            function listModelsConfigToMldev(apiClient, fromObject, parentObject) {
                const toObject = {};
                const fromPageSize = getValueByPath(fromObject, [
                    'pageSize'
                ]);
                if (parentObject !== undefined && fromPageSize != null) setValueByPath(parentObject, [
                    '_query',
                    'pageSize'
                ], fromPageSize);
                const fromPageToken = getValueByPath(fromObject, [
                    'pageToken'
                ]);
                if (parentObject !== undefined && fromPageToken != null) setValueByPath(parentObject, [
                    '_query',
                    'pageToken'
                ], fromPageToken);
                const fromFilter = getValueByPath(fromObject, [
                    'filter'
                ]);
                if (parentObject !== undefined && fromFilter != null) setValueByPath(parentObject, [
                    '_query',
                    'filter'
                ], fromFilter);
                const fromQueryBase = getValueByPath(fromObject, [
                    'queryBase'
                ]);
                if (parentObject !== undefined && fromQueryBase != null) setValueByPath(parentObject, [
                    '_url',
                    'models_url'
                ], tModelsUrl(apiClient, fromQueryBase));
                return toObject;
            }
            function listModelsConfigToVertex(apiClient, fromObject, parentObject) {
                const toObject = {};
                const fromPageSize = getValueByPath(fromObject, [
                    'pageSize'
                ]);
                if (parentObject !== undefined && fromPageSize != null) setValueByPath(parentObject, [
                    '_query',
                    'pageSize'
                ], fromPageSize);
                const fromPageToken = getValueByPath(fromObject, [
                    'pageToken'
                ]);
                if (parentObject !== undefined && fromPageToken != null) setValueByPath(parentObject, [
                    '_query',
                    'pageToken'
                ], fromPageToken);
                const fromFilter = getValueByPath(fromObject, [
                    'filter'
                ]);
                if (parentObject !== undefined && fromFilter != null) setValueByPath(parentObject, [
                    '_query',
                    'filter'
                ], fromFilter);
                const fromQueryBase = getValueByPath(fromObject, [
                    'queryBase'
                ]);
                if (parentObject !== undefined && fromQueryBase != null) setValueByPath(parentObject, [
                    '_url',
                    'models_url'
                ], tModelsUrl(apiClient, fromQueryBase));
                return toObject;
            }
            function listModelsParametersToMldev(apiClient, fromObject) {
                const toObject = {};
                const fromConfig = getValueByPath(fromObject, [
                    'config'
                ]);
                if (fromConfig != null) listModelsConfigToMldev(apiClient, fromConfig, toObject);
                return toObject;
            }
            function listModelsParametersToVertex(apiClient, fromObject) {
                const toObject = {};
                const fromConfig = getValueByPath(fromObject, [
                    'config'
                ]);
                if (fromConfig != null) listModelsConfigToVertex(apiClient, fromConfig, toObject);
                return toObject;
            }
            function listModelsResponseFromMldev(fromObject) {
                const toObject = {};
                const fromSdkHttpResponse = getValueByPath(fromObject, [
                    'sdkHttpResponse'
                ]);
                if (fromSdkHttpResponse != null) setValueByPath(toObject, [
                    'sdkHttpResponse'
                ], fromSdkHttpResponse);
                const fromNextPageToken = getValueByPath(fromObject, [
                    'nextPageToken'
                ]);
                if (fromNextPageToken != null) setValueByPath(toObject, [
                    'nextPageToken'
                ], fromNextPageToken);
                const fromModels = getValueByPath(fromObject, [
                    '_self'
                ]);
                if (fromModels != null) {
                    let transformedList = tExtractModels(fromModels);
                    if (Array.isArray(transformedList)) transformedList = transformedList.map((item)=>{
                        return modelFromMldev(item);
                    });
                    setValueByPath(toObject, [
                        'models'
                    ], transformedList);
                }
                return toObject;
            }
            function listModelsResponseFromVertex(fromObject) {
                const toObject = {};
                const fromSdkHttpResponse = getValueByPath(fromObject, [
                    'sdkHttpResponse'
                ]);
                if (fromSdkHttpResponse != null) setValueByPath(toObject, [
                    'sdkHttpResponse'
                ], fromSdkHttpResponse);
                const fromNextPageToken = getValueByPath(fromObject, [
                    'nextPageToken'
                ]);
                if (fromNextPageToken != null) setValueByPath(toObject, [
                    'nextPageToken'
                ], fromNextPageToken);
                const fromModels = getValueByPath(fromObject, [
                    '_self'
                ]);
                if (fromModels != null) {
                    let transformedList = tExtractModels(fromModels);
                    if (Array.isArray(transformedList)) transformedList = transformedList.map((item)=>{
                        return modelFromVertex(item);
                    });
                    setValueByPath(toObject, [
                        'models'
                    ], transformedList);
                }
                return toObject;
            }
            function maskReferenceConfigToVertex(fromObject) {
                const toObject = {};
                const fromMaskMode = getValueByPath(fromObject, [
                    'maskMode'
                ]);
                if (fromMaskMode != null) setValueByPath(toObject, [
                    'maskMode'
                ], fromMaskMode);
                const fromSegmentationClasses = getValueByPath(fromObject, [
                    'segmentationClasses'
                ]);
                if (fromSegmentationClasses != null) setValueByPath(toObject, [
                    'maskClasses'
                ], fromSegmentationClasses);
                const fromMaskDilation = getValueByPath(fromObject, [
                    'maskDilation'
                ]);
                if (fromMaskDilation != null) setValueByPath(toObject, [
                    'dilation'
                ], fromMaskDilation);
                return toObject;
            }
            function modelFromMldev(fromObject) {
                const toObject = {};
                const fromName = getValueByPath(fromObject, [
                    'name'
                ]);
                if (fromName != null) setValueByPath(toObject, [
                    'name'
                ], fromName);
                const fromDisplayName = getValueByPath(fromObject, [
                    'displayName'
                ]);
                if (fromDisplayName != null) setValueByPath(toObject, [
                    'displayName'
                ], fromDisplayName);
                const fromDescription = getValueByPath(fromObject, [
                    'description'
                ]);
                if (fromDescription != null) setValueByPath(toObject, [
                    'description'
                ], fromDescription);
                const fromVersion = getValueByPath(fromObject, [
                    'version'
                ]);
                if (fromVersion != null) setValueByPath(toObject, [
                    'version'
                ], fromVersion);
                const fromTunedModelInfo = getValueByPath(fromObject, [
                    '_self'
                ]);
                if (fromTunedModelInfo != null) setValueByPath(toObject, [
                    'tunedModelInfo'
                ], tunedModelInfoFromMldev(fromTunedModelInfo));
                const fromInputTokenLimit = getValueByPath(fromObject, [
                    'inputTokenLimit'
                ]);
                if (fromInputTokenLimit != null) setValueByPath(toObject, [
                    'inputTokenLimit'
                ], fromInputTokenLimit);
                const fromOutputTokenLimit = getValueByPath(fromObject, [
                    'outputTokenLimit'
                ]);
                if (fromOutputTokenLimit != null) setValueByPath(toObject, [
                    'outputTokenLimit'
                ], fromOutputTokenLimit);
                const fromSupportedActions = getValueByPath(fromObject, [
                    'supportedGenerationMethods'
                ]);
                if (fromSupportedActions != null) setValueByPath(toObject, [
                    'supportedActions'
                ], fromSupportedActions);
                const fromTemperature = getValueByPath(fromObject, [
                    'temperature'
                ]);
                if (fromTemperature != null) setValueByPath(toObject, [
                    'temperature'
                ], fromTemperature);
                const fromMaxTemperature = getValueByPath(fromObject, [
                    'maxTemperature'
                ]);
                if (fromMaxTemperature != null) setValueByPath(toObject, [
                    'maxTemperature'
                ], fromMaxTemperature);
                const fromTopP = getValueByPath(fromObject, [
                    'topP'
                ]);
                if (fromTopP != null) setValueByPath(toObject, [
                    'topP'
                ], fromTopP);
                const fromTopK = getValueByPath(fromObject, [
                    'topK'
                ]);
                if (fromTopK != null) setValueByPath(toObject, [
                    'topK'
                ], fromTopK);
                const fromThinking = getValueByPath(fromObject, [
                    'thinking'
                ]);
                if (fromThinking != null) setValueByPath(toObject, [
                    'thinking'
                ], fromThinking);
                return toObject;
            }
            function modelFromVertex(fromObject) {
                const toObject = {};
                const fromName = getValueByPath(fromObject, [
                    'name'
                ]);
                if (fromName != null) setValueByPath(toObject, [
                    'name'
                ], fromName);
                const fromDisplayName = getValueByPath(fromObject, [
                    'displayName'
                ]);
                if (fromDisplayName != null) setValueByPath(toObject, [
                    'displayName'
                ], fromDisplayName);
                const fromDescription = getValueByPath(fromObject, [
                    'description'
                ]);
                if (fromDescription != null) setValueByPath(toObject, [
                    'description'
                ], fromDescription);
                const fromVersion = getValueByPath(fromObject, [
                    'versionId'
                ]);
                if (fromVersion != null) setValueByPath(toObject, [
                    'version'
                ], fromVersion);
                const fromEndpoints = getValueByPath(fromObject, [
                    'deployedModels'
                ]);
                if (fromEndpoints != null) {
                    let transformedList = fromEndpoints;
                    if (Array.isArray(transformedList)) transformedList = transformedList.map((item)=>{
                        return endpointFromVertex(item);
                    });
                    setValueByPath(toObject, [
                        'endpoints'
                    ], transformedList);
                }
                const fromLabels = getValueByPath(fromObject, [
                    'labels'
                ]);
                if (fromLabels != null) setValueByPath(toObject, [
                    'labels'
                ], fromLabels);
                const fromTunedModelInfo = getValueByPath(fromObject, [
                    '_self'
                ]);
                if (fromTunedModelInfo != null) setValueByPath(toObject, [
                    'tunedModelInfo'
                ], tunedModelInfoFromVertex(fromTunedModelInfo));
                const fromDefaultCheckpointId = getValueByPath(fromObject, [
                    'defaultCheckpointId'
                ]);
                if (fromDefaultCheckpointId != null) setValueByPath(toObject, [
                    'defaultCheckpointId'
                ], fromDefaultCheckpointId);
                const fromCheckpoints = getValueByPath(fromObject, [
                    'checkpoints'
                ]);
                if (fromCheckpoints != null) {
                    let transformedList = fromCheckpoints;
                    if (Array.isArray(transformedList)) transformedList = transformedList.map((item)=>{
                        return item;
                    });
                    setValueByPath(toObject, [
                        'checkpoints'
                    ], transformedList);
                }
                return toObject;
            }
            function partToMldev$1(fromObject) {
                const toObject = {};
                const fromMediaResolution = getValueByPath(fromObject, [
                    'mediaResolution'
                ]);
                if (fromMediaResolution != null) setValueByPath(toObject, [
                    'mediaResolution'
                ], fromMediaResolution);
                const fromCodeExecutionResult = getValueByPath(fromObject, [
                    'codeExecutionResult'
                ]);
                if (fromCodeExecutionResult != null) setValueByPath(toObject, [
                    'codeExecutionResult'
                ], fromCodeExecutionResult);
                const fromExecutableCode = getValueByPath(fromObject, [
                    'executableCode'
                ]);
                if (fromExecutableCode != null) setValueByPath(toObject, [
                    'executableCode'
                ], fromExecutableCode);
                const fromFileData = getValueByPath(fromObject, [
                    'fileData'
                ]);
                if (fromFileData != null) setValueByPath(toObject, [
                    'fileData'
                ], fileDataToMldev$1(fromFileData));
                const fromFunctionCall = getValueByPath(fromObject, [
                    'functionCall'
                ]);
                if (fromFunctionCall != null) setValueByPath(toObject, [
                    'functionCall'
                ], functionCallToMldev$1(fromFunctionCall));
                const fromFunctionResponse = getValueByPath(fromObject, [
                    'functionResponse'
                ]);
                if (fromFunctionResponse != null) setValueByPath(toObject, [
                    'functionResponse'
                ], fromFunctionResponse);
                const fromInlineData = getValueByPath(fromObject, [
                    'inlineData'
                ]);
                if (fromInlineData != null) setValueByPath(toObject, [
                    'inlineData'
                ], blobToMldev$1(fromInlineData));
                const fromText = getValueByPath(fromObject, [
                    'text'
                ]);
                if (fromText != null) setValueByPath(toObject, [
                    'text'
                ], fromText);
                const fromThought = getValueByPath(fromObject, [
                    'thought'
                ]);
                if (fromThought != null) setValueByPath(toObject, [
                    'thought'
                ], fromThought);
                const fromThoughtSignature = getValueByPath(fromObject, [
                    'thoughtSignature'
                ]);
                if (fromThoughtSignature != null) setValueByPath(toObject, [
                    'thoughtSignature'
                ], fromThoughtSignature);
                const fromVideoMetadata = getValueByPath(fromObject, [
                    'videoMetadata'
                ]);
                if (fromVideoMetadata != null) setValueByPath(toObject, [
                    'videoMetadata'
                ], fromVideoMetadata);
                return toObject;
            }
            function productImageToVertex(fromObject) {
                const toObject = {};
                const fromProductImage = getValueByPath(fromObject, [
                    'productImage'
                ]);
                if (fromProductImage != null) setValueByPath(toObject, [
                    'image'
                ], imageToVertex(fromProductImage));
                return toObject;
            }
            function recontextImageConfigToVertex(fromObject, parentObject) {
                const toObject = {};
                const fromNumberOfImages = getValueByPath(fromObject, [
                    'numberOfImages'
                ]);
                if (parentObject !== undefined && fromNumberOfImages != null) setValueByPath(parentObject, [
                    'parameters',
                    'sampleCount'
                ], fromNumberOfImages);
                const fromBaseSteps = getValueByPath(fromObject, [
                    'baseSteps'
                ]);
                if (parentObject !== undefined && fromBaseSteps != null) setValueByPath(parentObject, [
                    'parameters',
                    'baseSteps'
                ], fromBaseSteps);
                const fromOutputGcsUri = getValueByPath(fromObject, [
                    'outputGcsUri'
                ]);
                if (parentObject !== undefined && fromOutputGcsUri != null) setValueByPath(parentObject, [
                    'parameters',
                    'storageUri'
                ], fromOutputGcsUri);
                const fromSeed = getValueByPath(fromObject, [
                    'seed'
                ]);
                if (parentObject !== undefined && fromSeed != null) setValueByPath(parentObject, [
                    'parameters',
                    'seed'
                ], fromSeed);
                const fromSafetyFilterLevel = getValueByPath(fromObject, [
                    'safetyFilterLevel'
                ]);
                if (parentObject !== undefined && fromSafetyFilterLevel != null) setValueByPath(parentObject, [
                    'parameters',
                    'safetySetting'
                ], fromSafetyFilterLevel);
                const fromPersonGeneration = getValueByPath(fromObject, [
                    'personGeneration'
                ]);
                if (parentObject !== undefined && fromPersonGeneration != null) setValueByPath(parentObject, [
                    'parameters',
                    'personGeneration'
                ], fromPersonGeneration);
                const fromAddWatermark = getValueByPath(fromObject, [
                    'addWatermark'
                ]);
                if (parentObject !== undefined && fromAddWatermark != null) setValueByPath(parentObject, [
                    'parameters',
                    'addWatermark'
                ], fromAddWatermark);
                const fromOutputMimeType = getValueByPath(fromObject, [
                    'outputMimeType'
                ]);
                if (parentObject !== undefined && fromOutputMimeType != null) setValueByPath(parentObject, [
                    'parameters',
                    'outputOptions',
                    'mimeType'
                ], fromOutputMimeType);
                const fromOutputCompressionQuality = getValueByPath(fromObject, [
                    'outputCompressionQuality'
                ]);
                if (parentObject !== undefined && fromOutputCompressionQuality != null) setValueByPath(parentObject, [
                    'parameters',
                    'outputOptions',
                    'compressionQuality'
                ], fromOutputCompressionQuality);
                const fromEnhancePrompt = getValueByPath(fromObject, [
                    'enhancePrompt'
                ]);
                if (parentObject !== undefined && fromEnhancePrompt != null) setValueByPath(parentObject, [
                    'parameters',
                    'enhancePrompt'
                ], fromEnhancePrompt);
                const fromLabels = getValueByPath(fromObject, [
                    'labels'
                ]);
                if (parentObject !== undefined && fromLabels != null) setValueByPath(parentObject, [
                    'labels'
                ], fromLabels);
                return toObject;
            }
            function recontextImageParametersToVertex(apiClient, fromObject) {
                const toObject = {};
                const fromModel = getValueByPath(fromObject, [
                    'model'
                ]);
                if (fromModel != null) setValueByPath(toObject, [
                    '_url',
                    'model'
                ], tModel(apiClient, fromModel));
                const fromSource = getValueByPath(fromObject, [
                    'source'
                ]);
                if (fromSource != null) recontextImageSourceToVertex(fromSource, toObject);
                const fromConfig = getValueByPath(fromObject, [
                    'config'
                ]);
                if (fromConfig != null) recontextImageConfigToVertex(fromConfig, toObject);
                return toObject;
            }
            function recontextImageResponseFromVertex(fromObject) {
                const toObject = {};
                const fromGeneratedImages = getValueByPath(fromObject, [
                    'predictions'
                ]);
                if (fromGeneratedImages != null) {
                    let transformedList = fromGeneratedImages;
                    if (Array.isArray(transformedList)) transformedList = transformedList.map((item)=>{
                        return generatedImageFromVertex(item);
                    });
                    setValueByPath(toObject, [
                        'generatedImages'
                    ], transformedList);
                }
                return toObject;
            }
            function recontextImageSourceToVertex(fromObject, parentObject) {
                const toObject = {};
                const fromPrompt = getValueByPath(fromObject, [
                    'prompt'
                ]);
                if (parentObject !== undefined && fromPrompt != null) setValueByPath(parentObject, [
                    'instances[0]',
                    'prompt'
                ], fromPrompt);
                const fromPersonImage = getValueByPath(fromObject, [
                    'personImage'
                ]);
                if (parentObject !== undefined && fromPersonImage != null) setValueByPath(parentObject, [
                    'instances[0]',
                    'personImage',
                    'image'
                ], imageToVertex(fromPersonImage));
                const fromProductImages = getValueByPath(fromObject, [
                    'productImages'
                ]);
                if (parentObject !== undefined && fromProductImages != null) {
                    let transformedList = fromProductImages;
                    if (Array.isArray(transformedList)) transformedList = transformedList.map((item)=>{
                        return productImageToVertex(item);
                    });
                    setValueByPath(parentObject, [
                        'instances[0]',
                        'productImages'
                    ], transformedList);
                }
                return toObject;
            }
            function referenceImageAPIInternalToVertex(fromObject) {
                const toObject = {};
                const fromReferenceImage = getValueByPath(fromObject, [
                    'referenceImage'
                ]);
                if (fromReferenceImage != null) setValueByPath(toObject, [
                    'referenceImage'
                ], imageToVertex(fromReferenceImage));
                const fromReferenceId = getValueByPath(fromObject, [
                    'referenceId'
                ]);
                if (fromReferenceId != null) setValueByPath(toObject, [
                    'referenceId'
                ], fromReferenceId);
                const fromReferenceType = getValueByPath(fromObject, [
                    'referenceType'
                ]);
                if (fromReferenceType != null) setValueByPath(toObject, [
                    'referenceType'
                ], fromReferenceType);
                const fromMaskImageConfig = getValueByPath(fromObject, [
                    'maskImageConfig'
                ]);
                if (fromMaskImageConfig != null) setValueByPath(toObject, [
                    'maskImageConfig'
                ], maskReferenceConfigToVertex(fromMaskImageConfig));
                const fromControlImageConfig = getValueByPath(fromObject, [
                    'controlImageConfig'
                ]);
                if (fromControlImageConfig != null) setValueByPath(toObject, [
                    'controlImageConfig'
                ], controlReferenceConfigToVertex(fromControlImageConfig));
                const fromStyleImageConfig = getValueByPath(fromObject, [
                    'styleImageConfig'
                ]);
                if (fromStyleImageConfig != null) setValueByPath(toObject, [
                    'styleImageConfig'
                ], fromStyleImageConfig);
                const fromSubjectImageConfig = getValueByPath(fromObject, [
                    'subjectImageConfig'
                ]);
                if (fromSubjectImageConfig != null) setValueByPath(toObject, [
                    'subjectImageConfig'
                ], fromSubjectImageConfig);
                return toObject;
            }
            function safetyAttributesFromMldev(fromObject) {
                const toObject = {};
                const fromCategories = getValueByPath(fromObject, [
                    'safetyAttributes',
                    'categories'
                ]);
                if (fromCategories != null) setValueByPath(toObject, [
                    'categories'
                ], fromCategories);
                const fromScores = getValueByPath(fromObject, [
                    'safetyAttributes',
                    'scores'
                ]);
                if (fromScores != null) setValueByPath(toObject, [
                    'scores'
                ], fromScores);
                const fromContentType = getValueByPath(fromObject, [
                    'contentType'
                ]);
                if (fromContentType != null) setValueByPath(toObject, [
                    'contentType'
                ], fromContentType);
                return toObject;
            }
            function safetyAttributesFromVertex(fromObject) {
                const toObject = {};
                const fromCategories = getValueByPath(fromObject, [
                    'safetyAttributes',
                    'categories'
                ]);
                if (fromCategories != null) setValueByPath(toObject, [
                    'categories'
                ], fromCategories);
                const fromScores = getValueByPath(fromObject, [
                    'safetyAttributes',
                    'scores'
                ]);
                if (fromScores != null) setValueByPath(toObject, [
                    'scores'
                ], fromScores);
                const fromContentType = getValueByPath(fromObject, [
                    'contentType'
                ]);
                if (fromContentType != null) setValueByPath(toObject, [
                    'contentType'
                ], fromContentType);
                return toObject;
            }
            function safetySettingToMldev(fromObject) {
                const toObject = {};
                const fromCategory = getValueByPath(fromObject, [
                    'category'
                ]);
                if (fromCategory != null) setValueByPath(toObject, [
                    'category'
                ], fromCategory);
                if (getValueByPath(fromObject, [
                    'method'
                ]) !== undefined) throw new Error('method parameter is not supported in Gemini API.');
                const fromThreshold = getValueByPath(fromObject, [
                    'threshold'
                ]);
                if (fromThreshold != null) setValueByPath(toObject, [
                    'threshold'
                ], fromThreshold);
                return toObject;
            }
            function scribbleImageToVertex(fromObject) {
                const toObject = {};
                const fromImage = getValueByPath(fromObject, [
                    'image'
                ]);
                if (fromImage != null) setValueByPath(toObject, [
                    'image'
                ], imageToVertex(fromImage));
                return toObject;
            }
            function segmentImageConfigToVertex(fromObject, parentObject) {
                const toObject = {};
                const fromMode = getValueByPath(fromObject, [
                    'mode'
                ]);
                if (parentObject !== undefined && fromMode != null) setValueByPath(parentObject, [
                    'parameters',
                    'mode'
                ], fromMode);
                const fromMaxPredictions = getValueByPath(fromObject, [
                    'maxPredictions'
                ]);
                if (parentObject !== undefined && fromMaxPredictions != null) setValueByPath(parentObject, [
                    'parameters',
                    'maxPredictions'
                ], fromMaxPredictions);
                const fromConfidenceThreshold = getValueByPath(fromObject, [
                    'confidenceThreshold'
                ]);
                if (parentObject !== undefined && fromConfidenceThreshold != null) setValueByPath(parentObject, [
                    'parameters',
                    'confidenceThreshold'
                ], fromConfidenceThreshold);
                const fromMaskDilation = getValueByPath(fromObject, [
                    'maskDilation'
                ]);
                if (parentObject !== undefined && fromMaskDilation != null) setValueByPath(parentObject, [
                    'parameters',
                    'maskDilation'
                ], fromMaskDilation);
                const fromBinaryColorThreshold = getValueByPath(fromObject, [
                    'binaryColorThreshold'
                ]);
                if (parentObject !== undefined && fromBinaryColorThreshold != null) setValueByPath(parentObject, [
                    'parameters',
                    'binaryColorThreshold'
                ], fromBinaryColorThreshold);
                const fromLabels = getValueByPath(fromObject, [
                    'labels'
                ]);
                if (parentObject !== undefined && fromLabels != null) setValueByPath(parentObject, [
                    'labels'
                ], fromLabels);
                return toObject;
            }
            function segmentImageParametersToVertex(apiClient, fromObject) {
                const toObject = {};
                const fromModel = getValueByPath(fromObject, [
                    'model'
                ]);
                if (fromModel != null) setValueByPath(toObject, [
                    '_url',
                    'model'
                ], tModel(apiClient, fromModel));
                const fromSource = getValueByPath(fromObject, [
                    'source'
                ]);
                if (fromSource != null) segmentImageSourceToVertex(fromSource, toObject);
                const fromConfig = getValueByPath(fromObject, [
                    'config'
                ]);
                if (fromConfig != null) segmentImageConfigToVertex(fromConfig, toObject);
                return toObject;
            }
            function segmentImageResponseFromVertex(fromObject) {
                const toObject = {};
                const fromGeneratedMasks = getValueByPath(fromObject, [
                    'predictions'
                ]);
                if (fromGeneratedMasks != null) {
                    let transformedList = fromGeneratedMasks;
                    if (Array.isArray(transformedList)) transformedList = transformedList.map((item)=>{
                        return generatedImageMaskFromVertex(item);
                    });
                    setValueByPath(toObject, [
                        'generatedMasks'
                    ], transformedList);
                }
                return toObject;
            }
            function segmentImageSourceToVertex(fromObject, parentObject) {
                const toObject = {};
                const fromPrompt = getValueByPath(fromObject, [
                    'prompt'
                ]);
                if (parentObject !== undefined && fromPrompt != null) setValueByPath(parentObject, [
                    'instances[0]',
                    'prompt'
                ], fromPrompt);
                const fromImage = getValueByPath(fromObject, [
                    'image'
                ]);
                if (parentObject !== undefined && fromImage != null) setValueByPath(parentObject, [
                    'instances[0]',
                    'image'
                ], imageToVertex(fromImage));
                const fromScribbleImage = getValueByPath(fromObject, [
                    'scribbleImage'
                ]);
                if (parentObject !== undefined && fromScribbleImage != null) setValueByPath(parentObject, [
                    'instances[0]',
                    'scribble'
                ], scribbleImageToVertex(fromScribbleImage));
                return toObject;
            }
            function toolConfigToMldev(fromObject) {
                const toObject = {};
                const fromFunctionCallingConfig = getValueByPath(fromObject, [
                    'functionCallingConfig'
                ]);
                if (fromFunctionCallingConfig != null) setValueByPath(toObject, [
                    'functionCallingConfig'
                ], functionCallingConfigToMldev(fromFunctionCallingConfig));
                const fromRetrievalConfig = getValueByPath(fromObject, [
                    'retrievalConfig'
                ]);
                if (fromRetrievalConfig != null) setValueByPath(toObject, [
                    'retrievalConfig'
                ], fromRetrievalConfig);
                return toObject;
            }
            function toolToMldev$1(fromObject) {
                const toObject = {};
                const fromFunctionDeclarations = getValueByPath(fromObject, [
                    'functionDeclarations'
                ]);
                if (fromFunctionDeclarations != null) {
                    let transformedList = fromFunctionDeclarations;
                    if (Array.isArray(transformedList)) transformedList = transformedList.map((item)=>{
                        return item;
                    });
                    setValueByPath(toObject, [
                        'functionDeclarations'
                    ], transformedList);
                }
                if (getValueByPath(fromObject, [
                    'retrieval'
                ]) !== undefined) throw new Error('retrieval parameter is not supported in Gemini API.');
                const fromGoogleSearchRetrieval = getValueByPath(fromObject, [
                    'googleSearchRetrieval'
                ]);
                if (fromGoogleSearchRetrieval != null) setValueByPath(toObject, [
                    'googleSearchRetrieval'
                ], fromGoogleSearchRetrieval);
                const fromComputerUse = getValueByPath(fromObject, [
                    'computerUse'
                ]);
                if (fromComputerUse != null) setValueByPath(toObject, [
                    'computerUse'
                ], fromComputerUse);
                const fromFileSearch = getValueByPath(fromObject, [
                    'fileSearch'
                ]);
                if (fromFileSearch != null) setValueByPath(toObject, [
                    'fileSearch'
                ], fromFileSearch);
                const fromCodeExecution = getValueByPath(fromObject, [
                    'codeExecution'
                ]);
                if (fromCodeExecution != null) setValueByPath(toObject, [
                    'codeExecution'
                ], fromCodeExecution);
                if (getValueByPath(fromObject, [
                    'enterpriseWebSearch'
                ]) !== undefined) throw new Error('enterpriseWebSearch parameter is not supported in Gemini API.');
                const fromGoogleMaps = getValueByPath(fromObject, [
                    'googleMaps'
                ]);
                if (fromGoogleMaps != null) setValueByPath(toObject, [
                    'googleMaps'
                ], googleMapsToMldev$1(fromGoogleMaps));
                const fromGoogleSearch = getValueByPath(fromObject, [
                    'googleSearch'
                ]);
                if (fromGoogleSearch != null) setValueByPath(toObject, [
                    'googleSearch'
                ], googleSearchToMldev$1(fromGoogleSearch));
                const fromUrlContext = getValueByPath(fromObject, [
                    'urlContext'
                ]);
                if (fromUrlContext != null) setValueByPath(toObject, [
                    'urlContext'
                ], fromUrlContext);
                return toObject;
            }
            function toolToVertex(fromObject) {
                const toObject = {};
                const fromFunctionDeclarations = getValueByPath(fromObject, [
                    'functionDeclarations'
                ]);
                if (fromFunctionDeclarations != null) {
                    let transformedList = fromFunctionDeclarations;
                    if (Array.isArray(transformedList)) transformedList = transformedList.map((item)=>{
                        return functionDeclarationToVertex(item);
                    });
                    setValueByPath(toObject, [
                        'functionDeclarations'
                    ], transformedList);
                }
                const fromRetrieval = getValueByPath(fromObject, [
                    'retrieval'
                ]);
                if (fromRetrieval != null) setValueByPath(toObject, [
                    'retrieval'
                ], fromRetrieval);
                const fromGoogleSearchRetrieval = getValueByPath(fromObject, [
                    'googleSearchRetrieval'
                ]);
                if (fromGoogleSearchRetrieval != null) setValueByPath(toObject, [
                    'googleSearchRetrieval'
                ], fromGoogleSearchRetrieval);
                const fromComputerUse = getValueByPath(fromObject, [
                    'computerUse'
                ]);
                if (fromComputerUse != null) setValueByPath(toObject, [
                    'computerUse'
                ], fromComputerUse);
                if (getValueByPath(fromObject, [
                    'fileSearch'
                ]) !== undefined) throw new Error('fileSearch parameter is not supported in Vertex AI.');
                const fromCodeExecution = getValueByPath(fromObject, [
                    'codeExecution'
                ]);
                if (fromCodeExecution != null) setValueByPath(toObject, [
                    'codeExecution'
                ], fromCodeExecution);
                const fromEnterpriseWebSearch = getValueByPath(fromObject, [
                    'enterpriseWebSearch'
                ]);
                if (fromEnterpriseWebSearch != null) setValueByPath(toObject, [
                    'enterpriseWebSearch'
                ], fromEnterpriseWebSearch);
                const fromGoogleMaps = getValueByPath(fromObject, [
                    'googleMaps'
                ]);
                if (fromGoogleMaps != null) setValueByPath(toObject, [
                    'googleMaps'
                ], fromGoogleMaps);
                const fromGoogleSearch = getValueByPath(fromObject, [
                    'googleSearch'
                ]);
                if (fromGoogleSearch != null) setValueByPath(toObject, [
                    'googleSearch'
                ], fromGoogleSearch);
                const fromUrlContext = getValueByPath(fromObject, [
                    'urlContext'
                ]);
                if (fromUrlContext != null) setValueByPath(toObject, [
                    'urlContext'
                ], fromUrlContext);
                return toObject;
            }
            function tunedModelInfoFromMldev(fromObject) {
                const toObject = {};
                const fromBaseModel = getValueByPath(fromObject, [
                    'baseModel'
                ]);
                if (fromBaseModel != null) setValueByPath(toObject, [
                    'baseModel'
                ], fromBaseModel);
                const fromCreateTime = getValueByPath(fromObject, [
                    'createTime'
                ]);
                if (fromCreateTime != null) setValueByPath(toObject, [
                    'createTime'
                ], fromCreateTime);
                const fromUpdateTime = getValueByPath(fromObject, [
                    'updateTime'
                ]);
                if (fromUpdateTime != null) setValueByPath(toObject, [
                    'updateTime'
                ], fromUpdateTime);
                return toObject;
            }
            function tunedModelInfoFromVertex(fromObject) {
                const toObject = {};
                const fromBaseModel = getValueByPath(fromObject, [
                    'labels',
                    'google-vertex-llm-tuning-base-model-id'
                ]);
                if (fromBaseModel != null) setValueByPath(toObject, [
                    'baseModel'
                ], fromBaseModel);
                const fromCreateTime = getValueByPath(fromObject, [
                    'createTime'
                ]);
                if (fromCreateTime != null) setValueByPath(toObject, [
                    'createTime'
                ], fromCreateTime);
                const fromUpdateTime = getValueByPath(fromObject, [
                    'updateTime'
                ]);
                if (fromUpdateTime != null) setValueByPath(toObject, [
                    'updateTime'
                ], fromUpdateTime);
                return toObject;
            }
            function updateModelConfigToMldev(fromObject, parentObject) {
                const toObject = {};
                const fromDisplayName = getValueByPath(fromObject, [
                    'displayName'
                ]);
                if (parentObject !== undefined && fromDisplayName != null) setValueByPath(parentObject, [
                    'displayName'
                ], fromDisplayName);
                const fromDescription = getValueByPath(fromObject, [
                    'description'
                ]);
                if (parentObject !== undefined && fromDescription != null) setValueByPath(parentObject, [
                    'description'
                ], fromDescription);
                const fromDefaultCheckpointId = getValueByPath(fromObject, [
                    'defaultCheckpointId'
                ]);
                if (parentObject !== undefined && fromDefaultCheckpointId != null) setValueByPath(parentObject, [
                    'defaultCheckpointId'
                ], fromDefaultCheckpointId);
                return toObject;
            }
            function updateModelConfigToVertex(fromObject, parentObject) {
                const toObject = {};
                const fromDisplayName = getValueByPath(fromObject, [
                    'displayName'
                ]);
                if (parentObject !== undefined && fromDisplayName != null) setValueByPath(parentObject, [
                    'displayName'
                ], fromDisplayName);
                const fromDescription = getValueByPath(fromObject, [
                    'description'
                ]);
                if (parentObject !== undefined && fromDescription != null) setValueByPath(parentObject, [
                    'description'
                ], fromDescription);
                const fromDefaultCheckpointId = getValueByPath(fromObject, [
                    'defaultCheckpointId'
                ]);
                if (parentObject !== undefined && fromDefaultCheckpointId != null) setValueByPath(parentObject, [
                    'defaultCheckpointId'
                ], fromDefaultCheckpointId);
                return toObject;
            }
            function updateModelParametersToMldev(apiClient, fromObject) {
                const toObject = {};
                const fromModel = getValueByPath(fromObject, [
                    'model'
                ]);
                if (fromModel != null) setValueByPath(toObject, [
                    '_url',
                    'name'
                ], tModel(apiClient, fromModel));
                const fromConfig = getValueByPath(fromObject, [
                    'config'
                ]);
                if (fromConfig != null) updateModelConfigToMldev(fromConfig, toObject);
                return toObject;
            }
            function updateModelParametersToVertex(apiClient, fromObject) {
                const toObject = {};
                const fromModel = getValueByPath(fromObject, [
                    'model'
                ]);
                if (fromModel != null) setValueByPath(toObject, [
                    '_url',
                    'model'
                ], tModel(apiClient, fromModel));
                const fromConfig = getValueByPath(fromObject, [
                    'config'
                ]);
                if (fromConfig != null) updateModelConfigToVertex(fromConfig, toObject);
                return toObject;
            }
            function upscaleImageAPIConfigInternalToVertex(fromObject, parentObject) {
                const toObject = {};
                const fromOutputGcsUri = getValueByPath(fromObject, [
                    'outputGcsUri'
                ]);
                if (parentObject !== undefined && fromOutputGcsUri != null) setValueByPath(parentObject, [
                    'parameters',
                    'storageUri'
                ], fromOutputGcsUri);
                const fromSafetyFilterLevel = getValueByPath(fromObject, [
                    'safetyFilterLevel'
                ]);
                if (parentObject !== undefined && fromSafetyFilterLevel != null) setValueByPath(parentObject, [
                    'parameters',
                    'safetySetting'
                ], fromSafetyFilterLevel);
                const fromPersonGeneration = getValueByPath(fromObject, [
                    'personGeneration'
                ]);
                if (parentObject !== undefined && fromPersonGeneration != null) setValueByPath(parentObject, [
                    'parameters',
                    'personGeneration'
                ], fromPersonGeneration);
                const fromIncludeRaiReason = getValueByPath(fromObject, [
                    'includeRaiReason'
                ]);
                if (parentObject !== undefined && fromIncludeRaiReason != null) setValueByPath(parentObject, [
                    'parameters',
                    'includeRaiReason'
                ], fromIncludeRaiReason);
                const fromOutputMimeType = getValueByPath(fromObject, [
                    'outputMimeType'
                ]);
                if (parentObject !== undefined && fromOutputMimeType != null) setValueByPath(parentObject, [
                    'parameters',
                    'outputOptions',
                    'mimeType'
                ], fromOutputMimeType);
                const fromOutputCompressionQuality = getValueByPath(fromObject, [
                    'outputCompressionQuality'
                ]);
                if (parentObject !== undefined && fromOutputCompressionQuality != null) setValueByPath(parentObject, [
                    'parameters',
                    'outputOptions',
                    'compressionQuality'
                ], fromOutputCompressionQuality);
                const fromEnhanceInputImage = getValueByPath(fromObject, [
                    'enhanceInputImage'
                ]);
                if (parentObject !== undefined && fromEnhanceInputImage != null) setValueByPath(parentObject, [
                    'parameters',
                    'upscaleConfig',
                    'enhanceInputImage'
                ], fromEnhanceInputImage);
                const fromImagePreservationFactor = getValueByPath(fromObject, [
                    'imagePreservationFactor'
                ]);
                if (parentObject !== undefined && fromImagePreservationFactor != null) setValueByPath(parentObject, [
                    'parameters',
                    'upscaleConfig',
                    'imagePreservationFactor'
                ], fromImagePreservationFactor);
                const fromLabels = getValueByPath(fromObject, [
                    'labels'
                ]);
                if (parentObject !== undefined && fromLabels != null) setValueByPath(parentObject, [
                    'labels'
                ], fromLabels);
                const fromNumberOfImages = getValueByPath(fromObject, [
                    'numberOfImages'
                ]);
                if (parentObject !== undefined && fromNumberOfImages != null) setValueByPath(parentObject, [
                    'parameters',
                    'sampleCount'
                ], fromNumberOfImages);
                const fromMode = getValueByPath(fromObject, [
                    'mode'
                ]);
                if (parentObject !== undefined && fromMode != null) setValueByPath(parentObject, [
                    'parameters',
                    'mode'
                ], fromMode);
                return toObject;
            }
            function upscaleImageAPIParametersInternalToVertex(apiClient, fromObject) {
                const toObject = {};
                const fromModel = getValueByPath(fromObject, [
                    'model'
                ]);
                if (fromModel != null) setValueByPath(toObject, [
                    '_url',
                    'model'
                ], tModel(apiClient, fromModel));
                const fromImage = getValueByPath(fromObject, [
                    'image'
                ]);
                if (fromImage != null) setValueByPath(toObject, [
                    'instances[0]',
                    'image'
                ], imageToVertex(fromImage));
                const fromUpscaleFactor = getValueByPath(fromObject, [
                    'upscaleFactor'
                ]);
                if (fromUpscaleFactor != null) setValueByPath(toObject, [
                    'parameters',
                    'upscaleConfig',
                    'upscaleFactor'
                ], fromUpscaleFactor);
                const fromConfig = getValueByPath(fromObject, [
                    'config'
                ]);
                if (fromConfig != null) upscaleImageAPIConfigInternalToVertex(fromConfig, toObject);
                return toObject;
            }
            function upscaleImageResponseFromVertex(fromObject) {
                const toObject = {};
                const fromSdkHttpResponse = getValueByPath(fromObject, [
                    'sdkHttpResponse'
                ]);
                if (fromSdkHttpResponse != null) setValueByPath(toObject, [
                    'sdkHttpResponse'
                ], fromSdkHttpResponse);
                const fromGeneratedImages = getValueByPath(fromObject, [
                    'predictions'
                ]);
                if (fromGeneratedImages != null) {
                    let transformedList = fromGeneratedImages;
                    if (Array.isArray(transformedList)) transformedList = transformedList.map((item)=>{
                        return generatedImageFromVertex(item);
                    });
                    setValueByPath(toObject, [
                        'generatedImages'
                    ], transformedList);
                }
                return toObject;
            }
            function videoFromMldev(fromObject) {
                const toObject = {};
                const fromUri = getValueByPath(fromObject, [
                    'uri'
                ]);
                if (fromUri != null) setValueByPath(toObject, [
                    'uri'
                ], fromUri);
                const fromVideoBytes = getValueByPath(fromObject, [
                    'encodedVideo'
                ]);
                if (fromVideoBytes != null) setValueByPath(toObject, [
                    'videoBytes'
                ], tBytes(fromVideoBytes));
                const fromMimeType = getValueByPath(fromObject, [
                    'encoding'
                ]);
                if (fromMimeType != null) setValueByPath(toObject, [
                    'mimeType'
                ], fromMimeType);
                return toObject;
            }
            function videoFromVertex(fromObject) {
                const toObject = {};
                const fromUri = getValueByPath(fromObject, [
                    'gcsUri'
                ]);
                if (fromUri != null) setValueByPath(toObject, [
                    'uri'
                ], fromUri);
                const fromVideoBytes = getValueByPath(fromObject, [
                    'bytesBase64Encoded'
                ]);
                if (fromVideoBytes != null) setValueByPath(toObject, [
                    'videoBytes'
                ], tBytes(fromVideoBytes));
                const fromMimeType = getValueByPath(fromObject, [
                    'mimeType'
                ]);
                if (fromMimeType != null) setValueByPath(toObject, [
                    'mimeType'
                ], fromMimeType);
                return toObject;
            }
            function videoGenerationMaskToVertex(fromObject) {
                const toObject = {};
                const fromImage = getValueByPath(fromObject, [
                    'image'
                ]);
                if (fromImage != null) setValueByPath(toObject, [
                    '_self'
                ], imageToVertex(fromImage));
                const fromMaskMode = getValueByPath(fromObject, [
                    'maskMode'
                ]);
                if (fromMaskMode != null) setValueByPath(toObject, [
                    'maskMode'
                ], fromMaskMode);
                return toObject;
            }
            function videoGenerationReferenceImageToMldev(fromObject) {
                const toObject = {};
                const fromImage = getValueByPath(fromObject, [
                    'image'
                ]);
                if (fromImage != null) setValueByPath(toObject, [
                    'image'
                ], imageToMldev(fromImage));
                const fromReferenceType = getValueByPath(fromObject, [
                    'referenceType'
                ]);
                if (fromReferenceType != null) setValueByPath(toObject, [
                    'referenceType'
                ], fromReferenceType);
                return toObject;
            }
            function videoGenerationReferenceImageToVertex(fromObject) {
                const toObject = {};
                const fromImage = getValueByPath(fromObject, [
                    'image'
                ]);
                if (fromImage != null) setValueByPath(toObject, [
                    'image'
                ], imageToVertex(fromImage));
                const fromReferenceType = getValueByPath(fromObject, [
                    'referenceType'
                ]);
                if (fromReferenceType != null) setValueByPath(toObject, [
                    'referenceType'
                ], fromReferenceType);
                return toObject;
            }
            function videoToMldev(fromObject) {
                const toObject = {};
                const fromUri = getValueByPath(fromObject, [
                    'uri'
                ]);
                if (fromUri != null) setValueByPath(toObject, [
                    'uri'
                ], fromUri);
                const fromVideoBytes = getValueByPath(fromObject, [
                    'videoBytes'
                ]);
                if (fromVideoBytes != null) setValueByPath(toObject, [
                    'encodedVideo'
                ], tBytes(fromVideoBytes));
                const fromMimeType = getValueByPath(fromObject, [
                    'mimeType'
                ]);
                if (fromMimeType != null) setValueByPath(toObject, [
                    'encoding'
                ], fromMimeType);
                return toObject;
            }
            function videoToVertex(fromObject) {
                const toObject = {};
                const fromUri = getValueByPath(fromObject, [
                    'uri'
                ]);
                if (fromUri != null) setValueByPath(toObject, [
                    'gcsUri'
                ], fromUri);
                const fromVideoBytes = getValueByPath(fromObject, [
                    'videoBytes'
                ]);
                if (fromVideoBytes != null) setValueByPath(toObject, [
                    'bytesBase64Encoded'
                ], tBytes(fromVideoBytes));
                const fromMimeType = getValueByPath(fromObject, [
                    'mimeType'
                ]);
                if (fromMimeType != null) setValueByPath(toObject, [
                    'mimeType'
                ], fromMimeType);
                return toObject;
            }
            function createFileSearchStoreConfigToMldev(fromObject, parentObject) {
                const toObject = {};
                const fromDisplayName = getValueByPath(fromObject, [
                    'displayName'
                ]);
                if (parentObject !== undefined && fromDisplayName != null) setValueByPath(parentObject, [
                    'displayName'
                ], fromDisplayName);
                return toObject;
            }
            function createFileSearchStoreParametersToMldev(fromObject) {
                const toObject = {};
                const fromConfig = getValueByPath(fromObject, [
                    'config'
                ]);
                if (fromConfig != null) createFileSearchStoreConfigToMldev(fromConfig, toObject);
                return toObject;
            }
            function deleteFileSearchStoreConfigToMldev(fromObject, parentObject) {
                const toObject = {};
                const fromForce = getValueByPath(fromObject, [
                    'force'
                ]);
                if (parentObject !== undefined && fromForce != null) setValueByPath(parentObject, [
                    '_query',
                    'force'
                ], fromForce);
                return toObject;
            }
            function deleteFileSearchStoreParametersToMldev(fromObject) {
                const toObject = {};
                const fromName = getValueByPath(fromObject, [
                    'name'
                ]);
                if (fromName != null) setValueByPath(toObject, [
                    '_url',
                    'name'
                ], fromName);
                const fromConfig = getValueByPath(fromObject, [
                    'config'
                ]);
                if (fromConfig != null) deleteFileSearchStoreConfigToMldev(fromConfig, toObject);
                return toObject;
            }
            function getFileSearchStoreParametersToMldev(fromObject) {
                const toObject = {};
                const fromName = getValueByPath(fromObject, [
                    'name'
                ]);
                if (fromName != null) setValueByPath(toObject, [
                    '_url',
                    'name'
                ], fromName);
                return toObject;
            }
            function importFileConfigToMldev(fromObject, parentObject) {
                const toObject = {};
                const fromCustomMetadata = getValueByPath(fromObject, [
                    'customMetadata'
                ]);
                if (parentObject !== undefined && fromCustomMetadata != null) {
                    let transformedList = fromCustomMetadata;
                    if (Array.isArray(transformedList)) transformedList = transformedList.map((item)=>{
                        return item;
                    });
                    setValueByPath(parentObject, [
                        'customMetadata'
                    ], transformedList);
                }
                const fromChunkingConfig = getValueByPath(fromObject, [
                    'chunkingConfig'
                ]);
                if (parentObject !== undefined && fromChunkingConfig != null) setValueByPath(parentObject, [
                    'chunkingConfig'
                ], fromChunkingConfig);
                return toObject;
            }
            function importFileOperationFromMldev(fromObject) {
                const toObject = {};
                const fromName = getValueByPath(fromObject, [
                    'name'
                ]);
                if (fromName != null) setValueByPath(toObject, [
                    'name'
                ], fromName);
                const fromMetadata = getValueByPath(fromObject, [
                    'metadata'
                ]);
                if (fromMetadata != null) setValueByPath(toObject, [
                    'metadata'
                ], fromMetadata);
                const fromDone = getValueByPath(fromObject, [
                    'done'
                ]);
                if (fromDone != null) setValueByPath(toObject, [
                    'done'
                ], fromDone);
                const fromError = getValueByPath(fromObject, [
                    'error'
                ]);
                if (fromError != null) setValueByPath(toObject, [
                    'error'
                ], fromError);
                const fromResponse = getValueByPath(fromObject, [
                    'response'
                ]);
                if (fromResponse != null) setValueByPath(toObject, [
                    'response'
                ], importFileResponseFromMldev(fromResponse));
                return toObject;
            }
            function importFileParametersToMldev(fromObject) {
                const toObject = {};
                const fromFileSearchStoreName = getValueByPath(fromObject, [
                    'fileSearchStoreName'
                ]);
                if (fromFileSearchStoreName != null) setValueByPath(toObject, [
                    '_url',
                    'file_search_store_name'
                ], fromFileSearchStoreName);
                const fromFileName = getValueByPath(fromObject, [
                    'fileName'
                ]);
                if (fromFileName != null) setValueByPath(toObject, [
                    'fileName'
                ], fromFileName);
                const fromConfig = getValueByPath(fromObject, [
                    'config'
                ]);
                if (fromConfig != null) importFileConfigToMldev(fromConfig, toObject);
                return toObject;
            }
            function importFileResponseFromMldev(fromObject) {
                const toObject = {};
                const fromSdkHttpResponse = getValueByPath(fromObject, [
                    'sdkHttpResponse'
                ]);
                if (fromSdkHttpResponse != null) setValueByPath(toObject, [
                    'sdkHttpResponse'
                ], fromSdkHttpResponse);
                const fromParent = getValueByPath(fromObject, [
                    'parent'
                ]);
                if (fromParent != null) setValueByPath(toObject, [
                    'parent'
                ], fromParent);
                const fromDocumentName = getValueByPath(fromObject, [
                    'documentName'
                ]);
                if (fromDocumentName != null) setValueByPath(toObject, [
                    'documentName'
                ], fromDocumentName);
                return toObject;
            }
            function listFileSearchStoresConfigToMldev(fromObject, parentObject) {
                const toObject = {};
                const fromPageSize = getValueByPath(fromObject, [
                    'pageSize'
                ]);
                if (parentObject !== undefined && fromPageSize != null) setValueByPath(parentObject, [
                    '_query',
                    'pageSize'
                ], fromPageSize);
                const fromPageToken = getValueByPath(fromObject, [
                    'pageToken'
                ]);
                if (parentObject !== undefined && fromPageToken != null) setValueByPath(parentObject, [
                    '_query',
                    'pageToken'
                ], fromPageToken);
                return toObject;
            }
            function listFileSearchStoresParametersToMldev(fromObject) {
                const toObject = {};
                const fromConfig = getValueByPath(fromObject, [
                    'config'
                ]);
                if (fromConfig != null) listFileSearchStoresConfigToMldev(fromConfig, toObject);
                return toObject;
            }
            function listFileSearchStoresResponseFromMldev(fromObject) {
                const toObject = {};
                const fromSdkHttpResponse = getValueByPath(fromObject, [
                    'sdkHttpResponse'
                ]);
                if (fromSdkHttpResponse != null) setValueByPath(toObject, [
                    'sdkHttpResponse'
                ], fromSdkHttpResponse);
                const fromNextPageToken = getValueByPath(fromObject, [
                    'nextPageToken'
                ]);
                if (fromNextPageToken != null) setValueByPath(toObject, [
                    'nextPageToken'
                ], fromNextPageToken);
                const fromFileSearchStores = getValueByPath(fromObject, [
                    'fileSearchStores'
                ]);
                if (fromFileSearchStores != null) {
                    let transformedList = fromFileSearchStores;
                    if (Array.isArray(transformedList)) transformedList = transformedList.map((item)=>{
                        return item;
                    });
                    setValueByPath(toObject, [
                        'fileSearchStores'
                    ], transformedList);
                }
                return toObject;
            }
            function uploadToFileSearchStoreConfigToMldev(fromObject, parentObject) {
                const toObject = {};
                const fromMimeType = getValueByPath(fromObject, [
                    'mimeType'
                ]);
                if (parentObject !== undefined && fromMimeType != null) setValueByPath(parentObject, [
                    'mimeType'
                ], fromMimeType);
                const fromDisplayName = getValueByPath(fromObject, [
                    'displayName'
                ]);
                if (parentObject !== undefined && fromDisplayName != null) setValueByPath(parentObject, [
                    'displayName'
                ], fromDisplayName);
                const fromCustomMetadata = getValueByPath(fromObject, [
                    'customMetadata'
                ]);
                if (parentObject !== undefined && fromCustomMetadata != null) {
                    let transformedList = fromCustomMetadata;
                    if (Array.isArray(transformedList)) transformedList = transformedList.map((item)=>{
                        return item;
                    });
                    setValueByPath(parentObject, [
                        'customMetadata'
                    ], transformedList);
                }
                const fromChunkingConfig = getValueByPath(fromObject, [
                    'chunkingConfig'
                ]);
                if (parentObject !== undefined && fromChunkingConfig != null) setValueByPath(parentObject, [
                    'chunkingConfig'
                ], fromChunkingConfig);
                return toObject;
            }
            function uploadToFileSearchStoreParametersToMldev(fromObject) {
                const toObject = {};
                const fromFileSearchStoreName = getValueByPath(fromObject, [
                    'fileSearchStoreName'
                ]);
                if (fromFileSearchStoreName != null) setValueByPath(toObject, [
                    '_url',
                    'file_search_store_name'
                ], fromFileSearchStoreName);
                const fromConfig = getValueByPath(fromObject, [
                    'config'
                ]);
                if (fromConfig != null) uploadToFileSearchStoreConfigToMldev(fromConfig, toObject);
                return toObject;
            }
            function uploadToFileSearchStoreResumableResponseFromMldev(fromObject) {
                const toObject = {};
                const fromSdkHttpResponse = getValueByPath(fromObject, [
                    'sdkHttpResponse'
                ]);
                if (fromSdkHttpResponse != null) setValueByPath(toObject, [
                    'sdkHttpResponse'
                ], fromSdkHttpResponse);
                return toObject;
            }
            const CONTENT_TYPE_HEADER = 'Content-Type';
            const SERVER_TIMEOUT_HEADER = 'X-Server-Timeout';
            const USER_AGENT_HEADER = 'User-Agent';
            const GOOGLE_API_CLIENT_HEADER = 'x-goog-api-client';
            const SDK_VERSION = '1.34.0';
            const LIBRARY_LABEL = `google-genai-sdk/${SDK_VERSION}`;
            const VERTEX_AI_API_DEFAULT_VERSION = 'v1beta1';
            const GOOGLE_AI_API_DEFAULT_VERSION = 'v1beta';
            class ApiClient {
                constructor(opts){
                    var _a, _b;
                    this.clientOptions = Object.assign(Object.assign({}, opts), {
                        project: opts.project,
                        location: opts.location,
                        apiKey: opts.apiKey,
                        vertexai: opts.vertexai
                    });
                    const initHttpOptions = {};
                    if (this.clientOptions.vertexai) {
                        initHttpOptions.apiVersion = (_a = this.clientOptions.apiVersion) !== null && _a !== void 0 ? _a : VERTEX_AI_API_DEFAULT_VERSION;
                        initHttpOptions.baseUrl = this.baseUrlFromProjectLocation();
                        this.normalizeAuthParameters();
                    } else {
                        initHttpOptions.apiVersion = (_b = this.clientOptions.apiVersion) !== null && _b !== void 0 ? _b : GOOGLE_AI_API_DEFAULT_VERSION;
                        initHttpOptions.baseUrl = `https://generativelanguage.googleapis.com/`;
                    }
                    initHttpOptions.headers = this.getDefaultHeaders();
                    this.clientOptions.httpOptions = initHttpOptions;
                    if (opts.httpOptions) this.clientOptions.httpOptions = this.patchHttpOptions(initHttpOptions, opts.httpOptions);
                }
                baseUrlFromProjectLocation() {
                    if (this.clientOptions.project && this.clientOptions.location && this.clientOptions.location !== 'global') return `https://${this.clientOptions.location}-aiplatform.googleapis.com/`;
                    return `https://aiplatform.googleapis.com/`;
                }
                normalizeAuthParameters() {
                    if (this.clientOptions.project && this.clientOptions.location) {
                        this.clientOptions.apiKey = undefined;
                        return;
                    }
                    this.clientOptions.project = undefined;
                    this.clientOptions.location = undefined;
                }
                isVertexAI() {
                    var _a;
                    return (_a = this.clientOptions.vertexai) !== null && _a !== void 0 ? _a : false;
                }
                getProject() {
                    return this.clientOptions.project;
                }
                getLocation() {
                    return this.clientOptions.location;
                }
                async getAuthHeaders() {
                    const headers = new Headers();
                    await this.clientOptions.auth.addAuthHeaders(headers);
                    return headers;
                }
                getApiVersion() {
                    if (this.clientOptions.httpOptions && this.clientOptions.httpOptions.apiVersion !== undefined) return this.clientOptions.httpOptions.apiVersion;
                    throw new Error('API version is not set.');
                }
                getBaseUrl() {
                    if (this.clientOptions.httpOptions && this.clientOptions.httpOptions.baseUrl !== undefined) return this.clientOptions.httpOptions.baseUrl;
                    throw new Error('Base URL is not set.');
                }
                getRequestUrl() {
                    return this.getRequestUrlInternal(this.clientOptions.httpOptions);
                }
                getHeaders() {
                    if (this.clientOptions.httpOptions && this.clientOptions.httpOptions.headers !== undefined) return this.clientOptions.httpOptions.headers;
                    else throw new Error('Headers are not set.');
                }
                getRequestUrlInternal(httpOptions) {
                    if (!httpOptions || httpOptions.baseUrl === undefined || httpOptions.apiVersion === undefined) throw new Error('HTTP options are not correctly set.');
                    const baseUrl = httpOptions.baseUrl.endsWith('/') ? httpOptions.baseUrl.slice(0, -1) : httpOptions.baseUrl;
                    const urlElement = [
                        baseUrl
                    ];
                    if (httpOptions.apiVersion && httpOptions.apiVersion !== '') urlElement.push(httpOptions.apiVersion);
                    return urlElement.join('/');
                }
                getBaseResourcePath() {
                    return `projects/${this.clientOptions.project}/locations/${this.clientOptions.location}`;
                }
                getApiKey() {
                    return this.clientOptions.apiKey;
                }
                getWebsocketBaseUrl() {
                    const baseUrl = this.getBaseUrl();
                    const urlParts = new URL(baseUrl);
                    urlParts.protocol = urlParts.protocol == 'http:' ? 'ws' : 'wss';
                    return urlParts.toString();
                }
                setBaseUrl(url) {
                    if (this.clientOptions.httpOptions) this.clientOptions.httpOptions.baseUrl = url;
                    else throw new Error('HTTP options are not correctly set.');
                }
                constructUrl(path, httpOptions, prependProjectLocation) {
                    const urlElement = [
                        this.getRequestUrlInternal(httpOptions)
                    ];
                    if (prependProjectLocation) urlElement.push(this.getBaseResourcePath());
                    if (path !== '') urlElement.push(path);
                    const url = new URL(`${urlElement.join('/')}`);
                    return url;
                }
                shouldPrependVertexProjectPath(request) {
                    if (this.clientOptions.apiKey) return false;
                    if (!this.clientOptions.vertexai) return false;
                    if (request.path.startsWith('projects/')) return false;
                    if (request.httpMethod === 'GET' && request.path.startsWith('publishers/google/models')) return false;
                    return true;
                }
                async request(request) {
                    let patchedHttpOptions = this.clientOptions.httpOptions;
                    if (request.httpOptions) patchedHttpOptions = this.patchHttpOptions(this.clientOptions.httpOptions, request.httpOptions);
                    const prependProjectLocation = this.shouldPrependVertexProjectPath(request);
                    const url = this.constructUrl(request.path, patchedHttpOptions, prependProjectLocation);
                    if (request.queryParams) for (const [key, value] of Object.entries(request.queryParams))url.searchParams.append(key, String(value));
                    let requestInit = {};
                    if (request.httpMethod === 'GET') {
                        if (request.body && request.body !== '{}') throw new Error('Request body should be empty for GET request, but got non empty request body');
                    } else requestInit.body = request.body;
                    requestInit = await this.includeExtraHttpOptionsToRequestInit(requestInit, patchedHttpOptions, url.toString(), request.abortSignal);
                    return this.unaryApiCall(url, requestInit, request.httpMethod);
                }
                patchHttpOptions(baseHttpOptions, requestHttpOptions) {
                    const patchedHttpOptions = JSON.parse(JSON.stringify(baseHttpOptions));
                    for (const [key, value] of Object.entries(requestHttpOptions)){
                        if (typeof value === 'object') patchedHttpOptions[key] = Object.assign(Object.assign({}, patchedHttpOptions[key]), value);
                        else if (value !== undefined) patchedHttpOptions[key] = value;
                    }
                    return patchedHttpOptions;
                }
                async requestStream(request) {
                    let patchedHttpOptions = this.clientOptions.httpOptions;
                    if (request.httpOptions) patchedHttpOptions = this.patchHttpOptions(this.clientOptions.httpOptions, request.httpOptions);
                    const prependProjectLocation = this.shouldPrependVertexProjectPath(request);
                    const url = this.constructUrl(request.path, patchedHttpOptions, prependProjectLocation);
                    if (!url.searchParams.has('alt') || url.searchParams.get('alt') !== 'sse') url.searchParams.set('alt', 'sse');
                    let requestInit = {};
                    requestInit.body = request.body;
                    requestInit = await this.includeExtraHttpOptionsToRequestInit(requestInit, patchedHttpOptions, url.toString(), request.abortSignal);
                    return this.streamApiCall(url, requestInit, request.httpMethod);
                }
                async includeExtraHttpOptionsToRequestInit(requestInit, httpOptions, url, abortSignal) {
                    if (httpOptions && httpOptions.timeout || abortSignal) {
                        const abortController = new AbortController();
                        const signal = abortController.signal;
                        if (httpOptions.timeout && (httpOptions === null || httpOptions === void 0 ? void 0 : httpOptions.timeout) > 0) {
                            const timeoutHandle = setTimeout(()=>abortController.abort(), httpOptions.timeout);
                            if (timeoutHandle && typeof timeoutHandle.unref === 'function') timeoutHandle.unref();
                        }
                        if (abortSignal) abortSignal.addEventListener('abort', ()=>{
                            abortController.abort();
                        });
                        requestInit.signal = signal;
                    }
                    if (httpOptions && httpOptions.extraBody !== null) includeExtraBodyToRequestInit(requestInit, httpOptions.extraBody);
                    requestInit.headers = await this.getHeadersInternal(httpOptions, url);
                    return requestInit;
                }
                async unaryApiCall(url, requestInit, httpMethod) {
                    return this.apiCall(url.toString(), Object.assign(Object.assign({}, requestInit), {
                        method: httpMethod
                    })).then(async (response)=>{
                        await throwErrorIfNotOK(response);
                        return new HttpResponse(response);
                    }).catch((e)=>{
                        if (e instanceof Error) throw e;
                        else throw new Error(JSON.stringify(e));
                    });
                }
                async streamApiCall(url, requestInit, httpMethod) {
                    return this.apiCall(url.toString(), Object.assign(Object.assign({}, requestInit), {
                        method: httpMethod
                    })).then(async (response)=>{
                        await throwErrorIfNotOK(response);
                        return this.processStreamResponse(response);
                    }).catch((e)=>{
                        if (e instanceof Error) throw e;
                        else throw new Error(JSON.stringify(e));
                    });
                }
                processStreamResponse(response) {
                    return __asyncGenerator(this, arguments, function* processStreamResponse_1() {
                        var _a;
                        const reader = (_a = response === null || response === void 0 ? void 0 : response.body) === null || _a === void 0 ? void 0 : _a.getReader();
                        const decoder = new TextDecoder('utf-8');
                        if (!reader) throw new Error('Response body is empty');
                        try {
                            let buffer = '';
                            const dataPrefix = 'data:';
                            const delimiters = [
                                '\n\n',
                                '\r\r',
                                '\r\n\r\n'
                            ];
                            while(true){
                                const { done, value } = yield __await(reader.read());
                                if (done) {
                                    if (buffer.trim().length > 0) throw new Error('Incomplete JSON segment at the end');
                                    break;
                                }
                                const chunkString = decoder.decode(value, {
                                    stream: true
                                });
                                try {
                                    const chunkJson = JSON.parse(chunkString);
                                    if ('error' in chunkJson) {
                                        const errorJson = JSON.parse(JSON.stringify(chunkJson['error']));
                                        const status = errorJson['status'];
                                        const code = errorJson['code'];
                                        const errorMessage = `got status: ${status}. ${JSON.stringify(chunkJson)}`;
                                        if (code >= 400 && code < 600) {
                                            const apiError = new ApiError({
                                                message: errorMessage,
                                                status: code
                                            });
                                            throw apiError;
                                        }
                                    }
                                } catch (e) {
                                    const error = e;
                                    if (error.name === 'ApiError') throw e;
                                }
                                buffer += chunkString;
                                let delimiterIndex = -1;
                                let delimiterLength = 0;
                                while(true){
                                    delimiterIndex = -1;
                                    delimiterLength = 0;
                                    for (const delimiter of delimiters){
                                        const index = buffer.indexOf(delimiter);
                                        if (index !== -1 && (delimiterIndex === -1 || index < delimiterIndex)) {
                                            delimiterIndex = index;
                                            delimiterLength = delimiter.length;
                                        }
                                    }
                                    if (delimiterIndex === -1) break;
                                    const eventString = buffer.substring(0, delimiterIndex);
                                    buffer = buffer.substring(delimiterIndex + delimiterLength);
                                    const trimmedEvent = eventString.trim();
                                    if (trimmedEvent.startsWith(dataPrefix)) {
                                        const processedChunkString = trimmedEvent.substring(dataPrefix.length).trim();
                                        try {
                                            const partialResponse = new Response(processedChunkString, {
                                                headers: response === null || response === void 0 ? void 0 : response.headers,
                                                status: response === null || response === void 0 ? void 0 : response.status,
                                                statusText: response === null || response === void 0 ? void 0 : response.statusText
                                            });
                                            yield yield __await(new HttpResponse(partialResponse));
                                        } catch (e) {
                                            throw new Error(`exception parsing stream chunk ${processedChunkString}. ${e}`);
                                        }
                                    }
                                }
                            }
                        } finally{
                            reader.releaseLock();
                        }
                    });
                }
                async apiCall(url, requestInit) {
                    return fetch(url, requestInit).catch((e)=>{
                        throw new Error(`exception ${e} sending request`);
                    });
                }
                getDefaultHeaders() {
                    const headers = {};
                    const versionHeaderValue = LIBRARY_LABEL + ' ' + this.clientOptions.userAgentExtra;
                    headers[USER_AGENT_HEADER] = versionHeaderValue;
                    headers[GOOGLE_API_CLIENT_HEADER] = versionHeaderValue;
                    headers[CONTENT_TYPE_HEADER] = 'application/json';
                    return headers;
                }
                async getHeadersInternal(httpOptions, url) {
                    const headers = new Headers();
                    if (httpOptions && httpOptions.headers) {
                        for (const [key, value] of Object.entries(httpOptions.headers))headers.append(key, value);
                        if (httpOptions.timeout && httpOptions.timeout > 0) headers.append(SERVER_TIMEOUT_HEADER, String(Math.ceil(httpOptions.timeout / 1000)));
                    }
                    await this.clientOptions.auth.addAuthHeaders(headers, url);
                    return headers;
                }
                getFileName(file) {
                    var _a;
                    let fileName = '';
                    if (typeof file === 'string') {
                        fileName = file.replace(/[/\\]+$/, '');
                        fileName = (_a = fileName.split(/[/\\]/).pop()) !== null && _a !== void 0 ? _a : '';
                    }
                    return fileName;
                }
                async uploadFile(file, config) {
                    var _a;
                    const fileToUpload = {};
                    if (config != null) {
                        fileToUpload.mimeType = config.mimeType;
                        fileToUpload.name = config.name;
                        fileToUpload.displayName = config.displayName;
                    }
                    if (fileToUpload.name && !fileToUpload.name.startsWith('files/')) fileToUpload.name = `files/${fileToUpload.name}`;
                    const uploader = this.clientOptions.uploader;
                    const fileStat = await uploader.stat(file);
                    fileToUpload.sizeBytes = String(fileStat.size);
                    const mimeType = (_a = config === null || config === void 0 ? void 0 : config.mimeType) !== null && _a !== void 0 ? _a : fileStat.type;
                    if (mimeType === undefined || mimeType === '') throw new Error('Can not determine mimeType. Please provide mimeType in the config.');
                    fileToUpload.mimeType = mimeType;
                    const body = {
                        file: fileToUpload
                    };
                    const fileName = this.getFileName(file);
                    const path = formatMap('upload/v1beta/files', body['_url']);
                    const uploadUrl = await this.fetchUploadUrl(path, fileToUpload.sizeBytes, fileToUpload.mimeType, fileName, body, config === null || config === void 0 ? void 0 : config.httpOptions);
                    return uploader.upload(file, uploadUrl, this);
                }
                async uploadFileToFileSearchStore(fileSearchStoreName, file, config) {
                    var _a;
                    const uploader = this.clientOptions.uploader;
                    const fileStat = await uploader.stat(file);
                    const sizeBytes = String(fileStat.size);
                    const mimeType = (_a = config === null || config === void 0 ? void 0 : config.mimeType) !== null && _a !== void 0 ? _a : fileStat.type;
                    if (mimeType === undefined || mimeType === '') throw new Error('Can not determine mimeType. Please provide mimeType in the config.');
                    const path = `upload/v1beta/${fileSearchStoreName}:uploadToFileSearchStore`;
                    const fileName = this.getFileName(file);
                    const body = {};
                    if (config != null) uploadToFileSearchStoreConfigToMldev(config, body);
                    const uploadUrl = await this.fetchUploadUrl(path, sizeBytes, mimeType, fileName, body, config === null || config === void 0 ? void 0 : config.httpOptions);
                    return uploader.uploadToFileSearchStore(file, uploadUrl, this);
                }
                async downloadFile(params) {
                    const downloader = this.clientOptions.downloader;
                    await downloader.download(params, this);
                }
                async fetchUploadUrl(path, sizeBytes, mimeType, fileName, body, configHttpOptions) {
                    var _a;
                    let httpOptions = {};
                    if (configHttpOptions) httpOptions = configHttpOptions;
                    else httpOptions = {
                        apiVersion: '',
                        headers: Object.assign({
                            'Content-Type': 'application/json',
                            'X-Goog-Upload-Protocol': 'resumable',
                            'X-Goog-Upload-Command': 'start',
                            'X-Goog-Upload-Header-Content-Length': `${sizeBytes}`,
                            'X-Goog-Upload-Header-Content-Type': `${mimeType}`
                        }, fileName ? {
                            'X-Goog-Upload-File-Name': fileName
                        } : {})
                    };
                    const httpResponse = await this.request({
                        path,
                        body: JSON.stringify(body),
                        httpMethod: 'POST',
                        httpOptions
                    });
                    if (!httpResponse || !(httpResponse === null || httpResponse === void 0 ? void 0 : httpResponse.headers)) throw new Error('Server did not return an HttpResponse or the returned HttpResponse did not have headers.');
                    const uploadUrl = (_a = httpResponse === null || httpResponse === void 0 ? void 0 : httpResponse.headers) === null || _a === void 0 ? void 0 : _a['x-goog-upload-url'];
                    if (uploadUrl === undefined) throw new Error('Failed to get upload url. Server did not return the x-google-upload-url in the headers');
                    return uploadUrl;
                }
            }
            async function throwErrorIfNotOK(response) {
                var _a;
                if (response === undefined) throw new Error('response is undefined');
                if (!response.ok) {
                    const status = response.status;
                    let errorBody;
                    if ((_a = response.headers.get('content-type')) === null || _a === void 0 ? void 0 : _a.includes('application/json')) errorBody = await response.json();
                    else errorBody = {
                        error: {
                            message: await response.text(),
                            code: response.status,
                            status: response.statusText
                        }
                    };
                    const errorMessage = JSON.stringify(errorBody);
                    if (status >= 400 && status < 600) {
                        const apiError = new ApiError({
                            message: errorMessage,
                            status: status
                        });
                        throw apiError;
                    }
                    throw new Error(errorMessage);
                }
            }
            function includeExtraBodyToRequestInit(requestInit, extraBody) {
                if (!extraBody || Object.keys(extraBody).length === 0) return;
                if (requestInit.body instanceof Blob) {
                    console.warn('includeExtraBodyToRequestInit: extraBody provided but current request body is a Blob. extraBody will be ignored as merging is not supported for Blob bodies.');
                    return;
                }
                let currentBodyObject = {};
                if (typeof requestInit.body === 'string' && requestInit.body.length > 0) try {
                    const parsedBody = JSON.parse(requestInit.body);
                    if (typeof parsedBody === 'object' && parsedBody !== null && !Array.isArray(parsedBody)) currentBodyObject = parsedBody;
                    else {
                        console.warn('includeExtraBodyToRequestInit: Original request body is valid JSON but not a non-array object. Skip applying extraBody to the request body.');
                        return;
                    }
                } catch (e) {
                    console.warn('includeExtraBodyToRequestInit: Original request body is not valid JSON. Skip applying extraBody to the request body.');
                    return;
                }
                function deepMerge(target, source) {
                    const output = Object.assign({}, target);
                    for(const key in source)if (Object.prototype.hasOwnProperty.call(source, key)) {
                        const sourceValue = source[key];
                        const targetValue = output[key];
                        if (sourceValue && typeof sourceValue === 'object' && !Array.isArray(sourceValue) && targetValue && typeof targetValue === 'object' && !Array.isArray(targetValue)) output[key] = deepMerge(targetValue, sourceValue);
                        else {
                            if (targetValue && sourceValue && typeof targetValue !== typeof sourceValue) console.warn(`includeExtraBodyToRequestInit:deepMerge: Type mismatch for key "${key}". Original type: ${typeof targetValue}, New type: ${typeof sourceValue}. Overwriting.`);
                            output[key] = sourceValue;
                        }
                    }
                    return output;
                }
                const mergedBody = deepMerge(currentBodyObject, extraBody);
                requestInit.body = JSON.stringify(mergedBody);
            }
            const MCP_LABEL = 'mcp_used/unknown';
            let hasMcpToolUsageFromMcpToTool = false;
            function hasMcpToolUsage(tools) {
                for (const tool of tools){
                    if (isMcpCallableTool(tool)) return true;
                    if (typeof tool === 'object' && 'inputSchema' in tool) return true;
                }
                return hasMcpToolUsageFromMcpToTool;
            }
            function setMcpUsageHeader(headers) {
                var _a;
                const existingHeader = (_a = headers[GOOGLE_API_CLIENT_HEADER]) !== null && _a !== void 0 ? _a : '';
                headers[GOOGLE_API_CLIENT_HEADER] = (existingHeader + ` ${MCP_LABEL}`).trimStart();
            }
            function isMcpCallableTool(object) {
                return object !== null && typeof object === 'object' && object instanceof McpCallableTool;
            }
            function listAllTools(mcpClient_1) {
                return __asyncGenerator(this, arguments, function* listAllTools_1(mcpClient, maxTools = 100) {
                    let cursor = undefined;
                    let numTools = 0;
                    while(numTools < maxTools){
                        const t = yield __await(mcpClient.listTools({
                            cursor
                        }));
                        for (const tool of t.tools){
                            yield yield __await(tool);
                            numTools++;
                        }
                        if (!t.nextCursor) break;
                        cursor = t.nextCursor;
                    }
                });
            }
            class McpCallableTool {
                constructor(mcpClients = [], config){
                    this.mcpTools = [];
                    this.functionNameToMcpClient = {};
                    this.mcpClients = mcpClients;
                    this.config = config;
                }
                static create(mcpClients, config) {
                    return new McpCallableTool(mcpClients, config);
                }
                async initialize() {
                    var _a, e_1, _b, _c;
                    if (this.mcpTools.length > 0) return;
                    const functionMap = {};
                    const mcpTools = [];
                    for (const mcpClient of this.mcpClients)try {
                        for(var _d = true, _e = (e_1 = void 0, __asyncValues(listAllTools(mcpClient))), _f; _f = await _e.next(), _a = _f.done, !_a; _d = true){
                            _c = _f.value;
                            _d = false;
                            const mcpTool = _c;
                            mcpTools.push(mcpTool);
                            const mcpToolName = mcpTool.name;
                            if (functionMap[mcpToolName]) throw new Error(`Duplicate function name ${mcpToolName} found in MCP tools. Please ensure function names are unique.`);
                            functionMap[mcpToolName] = mcpClient;
                        }
                    } catch (e_1_1) {
                        e_1 = {
                            error: e_1_1
                        };
                    } finally{
                        try {
                            if (!_d && !_a && (_b = _e.return)) await _b.call(_e);
                        } finally{
                            if (e_1) throw e_1.error;
                        }
                    }
                    this.mcpTools = mcpTools;
                    this.functionNameToMcpClient = functionMap;
                }
                async tool() {
                    await this.initialize();
                    return mcpToolsToGeminiTool(this.mcpTools, this.config);
                }
                async callTool(functionCalls) {
                    await this.initialize();
                    const functionCallResponseParts = [];
                    for (const functionCall of functionCalls)if (functionCall.name in this.functionNameToMcpClient) {
                        const mcpClient = this.functionNameToMcpClient[functionCall.name];
                        let requestOptions = undefined;
                        if (this.config.timeout) requestOptions = {
                            timeout: this.config.timeout
                        };
                        const callToolResponse = await mcpClient.callTool({
                            name: functionCall.name,
                            arguments: functionCall.args
                        }, undefined, requestOptions);
                        functionCallResponseParts.push({
                            functionResponse: {
                                name: functionCall.name,
                                response: callToolResponse.isError ? {
                                    error: callToolResponse
                                } : callToolResponse
                            }
                        });
                    }
                    return functionCallResponseParts;
                }
            }
            function isMcpClient(client) {
                return client !== null && typeof client === 'object' && 'listTools' in client && typeof client.listTools === 'function';
            }
            function mcpToTool(...args) {
                hasMcpToolUsageFromMcpToTool = true;
                if (args.length === 0) throw new Error('No MCP clients provided');
                const maybeConfig = args[args.length - 1];
                if (isMcpClient(maybeConfig)) return McpCallableTool.create(args, {});
                return McpCallableTool.create(args.slice(0, args.length - 1), maybeConfig);
            }
            async function handleWebSocketMessage$1(apiClient, onmessage, event) {
                const serverMessage = new LiveMusicServerMessage();
                let data;
                if (event.data instanceof Blob) data = JSON.parse(await event.data.text());
                else data = JSON.parse(event.data);
                Object.assign(serverMessage, data);
                onmessage(serverMessage);
            }
            class LiveMusic {
                constructor(apiClient, auth, webSocketFactory){
                    this.apiClient = apiClient;
                    this.auth = auth;
                    this.webSocketFactory = webSocketFactory;
                }
                async connect(params) {
                    var _a, _b;
                    if (this.apiClient.isVertexAI()) throw new Error('Live music is not supported for Vertex AI.');
                    console.warn('Live music generation is experimental and may change in future versions.');
                    const websocketBaseUrl = this.apiClient.getWebsocketBaseUrl();
                    const apiVersion = this.apiClient.getApiVersion();
                    const headers = mapToHeaders$1(this.apiClient.getDefaultHeaders());
                    const apiKey = this.apiClient.getApiKey();
                    const url = `${websocketBaseUrl}/ws/google.ai.generativelanguage.${apiVersion}.GenerativeService.BidiGenerateMusic?key=${apiKey}`;
                    let onopenResolve = ()=>{};
                    const onopenPromise = new Promise((resolve)=>{
                        onopenResolve = resolve;
                    });
                    const callbacks = params.callbacks;
                    const onopenAwaitedCallback = function() {
                        onopenResolve({});
                    };
                    const apiClient = this.apiClient;
                    const websocketCallbacks = {
                        onopen: onopenAwaitedCallback,
                        onmessage: (event)=>{
                            handleWebSocketMessage$1(apiClient, callbacks.onmessage, event);
                        },
                        onerror: (_a = callbacks === null || callbacks === void 0 ? void 0 : callbacks.onerror) !== null && _a !== void 0 ? _a : function(e) {},
                        onclose: (_b = callbacks === null || callbacks === void 0 ? void 0 : callbacks.onclose) !== null && _b !== void 0 ? _b : function(e) {}
                    };
                    const conn = this.webSocketFactory.create(url, headersToMap$1(headers), websocketCallbacks);
                    conn.connect();
                    await onopenPromise;
                    const model = tModel(this.apiClient, params.model);
                    const setup = {
                        model
                    };
                    const clientMessage = {
                        setup
                    };
                    conn.send(JSON.stringify(clientMessage));
                    return new LiveMusicSession(conn, this.apiClient);
                }
            }
            class LiveMusicSession {
                constructor(conn, apiClient){
                    this.conn = conn;
                    this.apiClient = apiClient;
                }
                async setWeightedPrompts(params) {
                    if (!params.weightedPrompts || Object.keys(params.weightedPrompts).length === 0) throw new Error('Weighted prompts must be set and contain at least one entry.');
                    const clientContent = liveMusicSetWeightedPromptsParametersToMldev(params);
                    this.conn.send(JSON.stringify({
                        clientContent
                    }));
                }
                async setMusicGenerationConfig(params) {
                    if (!params.musicGenerationConfig) params.musicGenerationConfig = {};
                    const setConfigParameters = liveMusicSetConfigParametersToMldev(params);
                    this.conn.send(JSON.stringify(setConfigParameters));
                }
                sendPlaybackControl(playbackControl) {
                    const clientMessage = {
                        playbackControl
                    };
                    this.conn.send(JSON.stringify(clientMessage));
                }
                play() {
                    this.sendPlaybackControl(LiveMusicPlaybackControl.PLAY);
                }
                pause() {
                    this.sendPlaybackControl(LiveMusicPlaybackControl.PAUSE);
                }
                stop() {
                    this.sendPlaybackControl(LiveMusicPlaybackControl.STOP);
                }
                resetContext() {
                    this.sendPlaybackControl(LiveMusicPlaybackControl.RESET_CONTEXT);
                }
                close() {
                    this.conn.close();
                }
            }
            function headersToMap$1(headers) {
                const headerMap = {};
                headers.forEach((value, key)=>{
                    headerMap[key] = value;
                });
                return headerMap;
            }
            function mapToHeaders$1(map) {
                const headers = new Headers();
                for (const [key, value] of Object.entries(map))headers.append(key, value);
                return headers;
            }
            const FUNCTION_RESPONSE_REQUIRES_ID = 'FunctionResponse request must have an `id` field from the response of a ToolCall.FunctionalCalls in Google AI.';
            async function handleWebSocketMessage(apiClient, onmessage, event) {
                const serverMessage = new LiveServerMessage();
                let jsonData;
                if (event.data instanceof Blob) jsonData = await event.data.text();
                else if (event.data instanceof ArrayBuffer) jsonData = new TextDecoder().decode(event.data);
                else jsonData = event.data;
                const data = JSON.parse(jsonData);
                if (apiClient.isVertexAI()) {
                    const resp = liveServerMessageFromVertex(data);
                    Object.assign(serverMessage, resp);
                } else {
                    const resp = data;
                    Object.assign(serverMessage, resp);
                }
                onmessage(serverMessage);
            }
            class Live {
                constructor(apiClient, auth, webSocketFactory){
                    this.apiClient = apiClient;
                    this.auth = auth;
                    this.webSocketFactory = webSocketFactory;
                    this.music = new LiveMusic(this.apiClient, this.auth, this.webSocketFactory);
                }
                async connect(params) {
                    var _a, _b, _c, _d, _e, _f;
                    if (params.config && params.config.httpOptions) throw new Error("The Live module does not support httpOptions at request-level in LiveConnectConfig yet. Please use the client-level httpOptions configuration instead.");
                    const websocketBaseUrl = this.apiClient.getWebsocketBaseUrl();
                    const apiVersion = this.apiClient.getApiVersion();
                    let url;
                    const clientHeaders = this.apiClient.getHeaders();
                    if (params.config && params.config.tools && hasMcpToolUsage(params.config.tools)) setMcpUsageHeader(clientHeaders);
                    const headers = mapToHeaders(clientHeaders);
                    if (this.apiClient.isVertexAI()) {
                        url = `${websocketBaseUrl}/ws/google.cloud.aiplatform.${apiVersion}.LlmBidiService/BidiGenerateContent`;
                        await this.auth.addAuthHeaders(headers, url);
                    } else {
                        const apiKey = this.apiClient.getApiKey();
                        let method = 'BidiGenerateContent';
                        let keyName = 'key';
                        if (apiKey === null || apiKey === void 0 ? void 0 : apiKey.startsWith('auth_tokens/')) {
                            console.warn('Warning: Ephemeral token support is experimental and may change in future versions.');
                            if (apiVersion !== 'v1alpha') console.warn("Warning: The SDK's ephemeral token support is in v1alpha only. Please use const ai = new GoogleGenAI({apiKey: token.name, httpOptions: { apiVersion: 'v1alpha' }}); before session connection.");
                            method = 'BidiGenerateContentConstrained';
                            keyName = 'access_token';
                        }
                        url = `${websocketBaseUrl}/ws/google.ai.generativelanguage.${apiVersion}.GenerativeService.${method}?${keyName}=${apiKey}`;
                    }
                    let onopenResolve = ()=>{};
                    const onopenPromise = new Promise((resolve)=>{
                        onopenResolve = resolve;
                    });
                    const callbacks = params.callbacks;
                    const onopenAwaitedCallback = function() {
                        var _a;
                        (_a = callbacks === null || callbacks === void 0 ? void 0 : callbacks.onopen) === null || _a === void 0 || _a.call(callbacks);
                        onopenResolve({});
                    };
                    const apiClient = this.apiClient;
                    const websocketCallbacks = {
                        onopen: onopenAwaitedCallback,
                        onmessage: (event)=>{
                            handleWebSocketMessage(apiClient, callbacks.onmessage, event);
                        },
                        onerror: (_a = callbacks === null || callbacks === void 0 ? void 0 : callbacks.onerror) !== null && _a !== void 0 ? _a : function(e) {},
                        onclose: (_b = callbacks === null || callbacks === void 0 ? void 0 : callbacks.onclose) !== null && _b !== void 0 ? _b : function(e) {}
                    };
                    const conn = this.webSocketFactory.create(url, headersToMap(headers), websocketCallbacks);
                    conn.connect();
                    await onopenPromise;
                    let transformedModel = tModel(this.apiClient, params.model);
                    if (this.apiClient.isVertexAI() && transformedModel.startsWith('publishers/')) {
                        const project = this.apiClient.getProject();
                        const location = this.apiClient.getLocation();
                        transformedModel = `projects/${project}/locations/${location}/` + transformedModel;
                    }
                    let clientMessage = {};
                    if (this.apiClient.isVertexAI() && ((_c = params.config) === null || _c === void 0 ? void 0 : _c.responseModalities) === undefined) {
                        if (params.config === undefined) params.config = {
                            responseModalities: [
                                Modality.AUDIO
                            ]
                        };
                        else params.config.responseModalities = [
                            Modality.AUDIO
                        ];
                    }
                    if ((_d = params.config) === null || _d === void 0 ? void 0 : _d.generationConfig) console.warn('Setting `LiveConnectConfig.generation_config` is deprecated, please set the fields on `LiveConnectConfig` directly. This will become an error in a future version (not before Q3 2025).');
                    const inputTools = (_f = (_e = params.config) === null || _e === void 0 ? void 0 : _e.tools) !== null && _f !== void 0 ? _f : [];
                    const convertedTools = [];
                    for (const tool of inputTools)if (this.isCallableTool(tool)) {
                        const callableTool = tool;
                        convertedTools.push(await callableTool.tool());
                    } else convertedTools.push(tool);
                    if (convertedTools.length > 0) params.config.tools = convertedTools;
                    const liveConnectParameters = {
                        model: transformedModel,
                        config: params.config,
                        callbacks: params.callbacks
                    };
                    if (this.apiClient.isVertexAI()) clientMessage = liveConnectParametersToVertex(this.apiClient, liveConnectParameters);
                    else clientMessage = liveConnectParametersToMldev(this.apiClient, liveConnectParameters);
                    delete clientMessage['config'];
                    conn.send(JSON.stringify(clientMessage));
                    return new Session(conn, this.apiClient);
                }
                isCallableTool(tool) {
                    return 'callTool' in tool && typeof tool.callTool === 'function';
                }
            }
            const defaultLiveSendClientContentParamerters = {
                turnComplete: true
            };
            class Session {
                constructor(conn, apiClient){
                    this.conn = conn;
                    this.apiClient = apiClient;
                }
                tLiveClientContent(apiClient, params) {
                    if (params.turns !== null && params.turns !== undefined) {
                        let contents = [];
                        try {
                            contents = tContents(params.turns);
                            if (!apiClient.isVertexAI()) contents = contents.map((item)=>contentToMldev$1(item));
                        } catch (_a) {
                            throw new Error(`Failed to parse client content "turns", type: '${typeof params.turns}'`);
                        }
                        return {
                            clientContent: {
                                turns: contents,
                                turnComplete: params.turnComplete
                            }
                        };
                    }
                    return {
                        clientContent: {
                            turnComplete: params.turnComplete
                        }
                    };
                }
                tLiveClienttToolResponse(apiClient, params) {
                    let functionResponses = [];
                    if (params.functionResponses == null) throw new Error('functionResponses is required.');
                    if (!Array.isArray(params.functionResponses)) functionResponses = [
                        params.functionResponses
                    ];
                    else functionResponses = params.functionResponses;
                    if (functionResponses.length === 0) throw new Error('functionResponses is required.');
                    for (const functionResponse of functionResponses){
                        if (typeof functionResponse !== 'object' || functionResponse === null || !('name' in functionResponse) || !('response' in functionResponse)) throw new Error(`Could not parse function response, type '${typeof functionResponse}'.`);
                        if (!apiClient.isVertexAI() && !('id' in functionResponse)) throw new Error(FUNCTION_RESPONSE_REQUIRES_ID);
                    }
                    const clientMessage = {
                        toolResponse: {
                            functionResponses: functionResponses
                        }
                    };
                    return clientMessage;
                }
                sendClientContent(params) {
                    params = Object.assign(Object.assign({}, defaultLiveSendClientContentParamerters), params);
                    const clientMessage = this.tLiveClientContent(this.apiClient, params);
                    this.conn.send(JSON.stringify(clientMessage));
                }
                sendRealtimeInput(params) {
                    let clientMessage = {};
                    if (this.apiClient.isVertexAI()) clientMessage = {
                        'realtimeInput': liveSendRealtimeInputParametersToVertex(params)
                    };
                    else clientMessage = {
                        'realtimeInput': liveSendRealtimeInputParametersToMldev(params)
                    };
                    this.conn.send(JSON.stringify(clientMessage));
                }
                sendToolResponse(params) {
                    if (params.functionResponses == null) throw new Error('Tool response parameters are required.');
                    const clientMessage = this.tLiveClienttToolResponse(this.apiClient, params);
                    this.conn.send(JSON.stringify(clientMessage));
                }
                close() {
                    this.conn.close();
                }
            }
            function headersToMap(headers) {
                const headerMap = {};
                headers.forEach((value, key)=>{
                    headerMap[key] = value;
                });
                return headerMap;
            }
            function mapToHeaders(map) {
                const headers = new Headers();
                for (const [key, value] of Object.entries(map))headers.append(key, value);
                return headers;
            }
            const DEFAULT_MAX_REMOTE_CALLS = 10;
            function shouldDisableAfc(config) {
                var _a, _b, _c;
                if ((_a = config === null || config === void 0 ? void 0 : config.automaticFunctionCalling) === null || _a === void 0 ? void 0 : _a.disable) return true;
                let callableToolsPresent = false;
                for (const tool of (_b = config === null || config === void 0 ? void 0 : config.tools) !== null && _b !== void 0 ? _b : [])if (isCallableTool(tool)) {
                    callableToolsPresent = true;
                    break;
                }
                if (!callableToolsPresent) return true;
                const maxCalls = (_c = config === null || config === void 0 ? void 0 : config.automaticFunctionCalling) === null || _c === void 0 ? void 0 : _c.maximumRemoteCalls;
                if (maxCalls && (maxCalls < 0 || !Number.isInteger(maxCalls)) || maxCalls == 0) {
                    console.warn('Invalid maximumRemoteCalls value provided for automatic function calling. Disabled automatic function calling. Please provide a valid integer value greater than 0. maximumRemoteCalls provided:', maxCalls);
                    return true;
                }
                return false;
            }
            function isCallableTool(tool) {
                return 'callTool' in tool && typeof tool.callTool === 'function';
            }
            function hasCallableTools(params) {
                var _a, _b, _c;
                return (_c = (_b = (_a = params.config) === null || _a === void 0 ? void 0 : _a.tools) === null || _b === void 0 ? void 0 : _b.some((tool)=>isCallableTool(tool))) !== null && _c !== void 0 ? _c : false;
            }
            function findAfcIncompatibleToolIndexes(params) {
                var _a;
                const afcIncompatibleToolIndexes = [];
                if (!((_a = params === null || params === void 0 ? void 0 : params.config) === null || _a === void 0 ? void 0 : _a.tools)) return afcIncompatibleToolIndexes;
                params.config.tools.forEach((tool, index)=>{
                    if (isCallableTool(tool)) return;
                    const geminiTool = tool;
                    if (geminiTool.functionDeclarations && geminiTool.functionDeclarations.length > 0) afcIncompatibleToolIndexes.push(index);
                });
                return afcIncompatibleToolIndexes;
            }
            function shouldAppendAfcHistory(config) {
                var _a;
                return !((_a = config === null || config === void 0 ? void 0 : config.automaticFunctionCalling) === null || _a === void 0 ? void 0 : _a.ignoreCallHistory);
            }
            class Models extends BaseModule {
                constructor(apiClient){
                    super();
                    this.apiClient = apiClient;
                    this.generateContent = async (params)=>{
                        var _a, _b, _c, _d, _e;
                        const transformedParams = await this.processParamsMaybeAddMcpUsage(params);
                        this.maybeMoveToResponseJsonSchem(params);
                        if (!hasCallableTools(params) || shouldDisableAfc(params.config)) return await this.generateContentInternal(transformedParams);
                        const incompatibleToolIndexes = findAfcIncompatibleToolIndexes(params);
                        if (incompatibleToolIndexes.length > 0) {
                            const formattedIndexes = incompatibleToolIndexes.map((index)=>`tools[${index}]`).join(', ');
                            throw new Error(`Automatic function calling with CallableTools (or MCP objects) and basic FunctionDeclarations is not yet supported. Incompatible tools found at ${formattedIndexes}.`);
                        }
                        let response;
                        let functionResponseContent;
                        const automaticFunctionCallingHistory = tContents(transformedParams.contents);
                        const maxRemoteCalls = (_c = (_b = (_a = transformedParams.config) === null || _a === void 0 ? void 0 : _a.automaticFunctionCalling) === null || _b === void 0 ? void 0 : _b.maximumRemoteCalls) !== null && _c !== void 0 ? _c : DEFAULT_MAX_REMOTE_CALLS;
                        let remoteCalls = 0;
                        while(remoteCalls < maxRemoteCalls){
                            response = await this.generateContentInternal(transformedParams);
                            if (!response.functionCalls || response.functionCalls.length === 0) break;
                            const responseContent = response.candidates[0].content;
                            const functionResponseParts = [];
                            for (const tool of (_e = (_d = params.config) === null || _d === void 0 ? void 0 : _d.tools) !== null && _e !== void 0 ? _e : [])if (isCallableTool(tool)) {
                                const callableTool = tool;
                                const parts = await callableTool.callTool(response.functionCalls);
                                functionResponseParts.push(...parts);
                            }
                            remoteCalls++;
                            functionResponseContent = {
                                role: 'user',
                                parts: functionResponseParts
                            };
                            transformedParams.contents = tContents(transformedParams.contents);
                            transformedParams.contents.push(responseContent);
                            transformedParams.contents.push(functionResponseContent);
                            if (shouldAppendAfcHistory(transformedParams.config)) {
                                automaticFunctionCallingHistory.push(responseContent);
                                automaticFunctionCallingHistory.push(functionResponseContent);
                            }
                        }
                        if (shouldAppendAfcHistory(transformedParams.config)) response.automaticFunctionCallingHistory = automaticFunctionCallingHistory;
                        return response;
                    };
                    this.generateContentStream = async (params)=>{
                        var _a, _b, _c, _d, _e;
                        this.maybeMoveToResponseJsonSchem(params);
                        if (shouldDisableAfc(params.config)) {
                            const transformedParams = await this.processParamsMaybeAddMcpUsage(params);
                            return await this.generateContentStreamInternal(transformedParams);
                        }
                        const incompatibleToolIndexes = findAfcIncompatibleToolIndexes(params);
                        if (incompatibleToolIndexes.length > 0) {
                            const formattedIndexes = incompatibleToolIndexes.map((index)=>`tools[${index}]`).join(', ');
                            throw new Error(`Incompatible tools found at ${formattedIndexes}. Automatic function calling with CallableTools (or MCP objects) and basic FunctionDeclarations" is not yet supported.`);
                        }
                        const streamFunctionCall = (_c = (_b = (_a = params === null || params === void 0 ? void 0 : params.config) === null || _a === void 0 ? void 0 : _a.toolConfig) === null || _b === void 0 ? void 0 : _b.functionCallingConfig) === null || _c === void 0 ? void 0 : _c.streamFunctionCallArguments;
                        const disableAfc = (_e = (_d = params === null || params === void 0 ? void 0 : params.config) === null || _d === void 0 ? void 0 : _d.automaticFunctionCalling) === null || _e === void 0 ? void 0 : _e.disable;
                        if (streamFunctionCall && !disableAfc) throw new Error("Running in streaming mode with 'streamFunctionCallArguments' enabled, this feature is not compatible with automatic function calling (AFC). Please set 'config.automaticFunctionCalling.disable' to true to disable AFC or leave 'config.toolConfig.functionCallingConfig.streamFunctionCallArguments' to be undefined or set to false to disable streaming function call arguments feature.");
                        return await this.processAfcStream(params);
                    };
                    this.generateImages = async (params)=>{
                        return await this.generateImagesInternal(params).then((apiResponse)=>{
                            var _a;
                            let positivePromptSafetyAttributes;
                            const generatedImages = [];
                            if (apiResponse === null || apiResponse === void 0 ? void 0 : apiResponse.generatedImages) {
                                for (const generatedImage of apiResponse.generatedImages)if (generatedImage && (generatedImage === null || generatedImage === void 0 ? void 0 : generatedImage.safetyAttributes) && ((_a = generatedImage === null || generatedImage === void 0 ? void 0 : generatedImage.safetyAttributes) === null || _a === void 0 ? void 0 : _a.contentType) === 'Positive Prompt') positivePromptSafetyAttributes = generatedImage === null || generatedImage === void 0 ? void 0 : generatedImage.safetyAttributes;
                                else generatedImages.push(generatedImage);
                            }
                            let response;
                            if (positivePromptSafetyAttributes) response = {
                                generatedImages: generatedImages,
                                positivePromptSafetyAttributes: positivePromptSafetyAttributes,
                                sdkHttpResponse: apiResponse.sdkHttpResponse
                            };
                            else response = {
                                generatedImages: generatedImages,
                                sdkHttpResponse: apiResponse.sdkHttpResponse
                            };
                            return response;
                        });
                    };
                    this.list = async (params)=>{
                        var _a;
                        const defaultConfig = {
                            queryBase: true
                        };
                        const actualConfig = Object.assign(Object.assign({}, defaultConfig), params === null || params === void 0 ? void 0 : params.config);
                        const actualParams = {
                            config: actualConfig
                        };
                        if (this.apiClient.isVertexAI()) {
                            if (!actualParams.config.queryBase) {
                                if ((_a = actualParams.config) === null || _a === void 0 ? void 0 : _a.filter) throw new Error('Filtering tuned models list for Vertex AI is not currently supported');
                                else actualParams.config.filter = 'labels.tune-type:*';
                            }
                        }
                        return new Pager(PagedItem.PAGED_ITEM_MODELS, (x)=>this.listInternal(x), await this.listInternal(actualParams), actualParams);
                    };
                    this.editImage = async (params)=>{
                        const paramsInternal = {
                            model: params.model,
                            prompt: params.prompt,
                            referenceImages: [],
                            config: params.config
                        };
                        if (params.referenceImages) {
                            if (params.referenceImages) paramsInternal.referenceImages = params.referenceImages.map((img)=>img.toReferenceImageAPI());
                        }
                        return await this.editImageInternal(paramsInternal);
                    };
                    this.upscaleImage = async (params)=>{
                        let apiConfig = {
                            numberOfImages: 1,
                            mode: 'upscale'
                        };
                        if (params.config) apiConfig = Object.assign(Object.assign({}, apiConfig), params.config);
                        const apiParams = {
                            model: params.model,
                            image: params.image,
                            upscaleFactor: params.upscaleFactor,
                            config: apiConfig
                        };
                        return await this.upscaleImageInternal(apiParams);
                    };
                    this.generateVideos = async (params)=>{
                        var _a, _b, _c, _d, _e, _f;
                        if ((params.prompt || params.image || params.video) && params.source) throw new Error('Source and prompt/image/video are mutually exclusive. Please only use source.');
                        if (!this.apiClient.isVertexAI()) {
                            if (((_a = params.video) === null || _a === void 0 ? void 0 : _a.uri) && ((_b = params.video) === null || _b === void 0 ? void 0 : _b.videoBytes)) params.video = {
                                uri: params.video.uri,
                                mimeType: params.video.mimeType
                            };
                            else if (((_d = (_c = params.source) === null || _c === void 0 ? void 0 : _c.video) === null || _d === void 0 ? void 0 : _d.uri) && ((_f = (_e = params.source) === null || _e === void 0 ? void 0 : _e.video) === null || _f === void 0 ? void 0 : _f.videoBytes)) params.source.video = {
                                uri: params.source.video.uri,
                                mimeType: params.source.video.mimeType
                            };
                        }
                        return await this.generateVideosInternal(params);
                    };
                }
                maybeMoveToResponseJsonSchem(params) {
                    if (params.config && params.config.responseSchema) {
                        if (!params.config.responseJsonSchema) {
                            if (Object.keys(params.config.responseSchema).includes('$schema')) {
                                params.config.responseJsonSchema = params.config.responseSchema;
                                delete params.config.responseSchema;
                            }
                        }
                    }
                    return;
                }
                async processParamsMaybeAddMcpUsage(params) {
                    var _a, _b, _c;
                    const tools = (_a = params.config) === null || _a === void 0 ? void 0 : _a.tools;
                    if (!tools) return params;
                    const transformedTools = await Promise.all(tools.map(async (tool)=>{
                        if (isCallableTool(tool)) {
                            const callableTool = tool;
                            return await callableTool.tool();
                        }
                        return tool;
                    }));
                    const newParams = {
                        model: params.model,
                        contents: params.contents,
                        config: Object.assign(Object.assign({}, params.config), {
                            tools: transformedTools
                        })
                    };
                    newParams.config.tools = transformedTools;
                    if (params.config && params.config.tools && hasMcpToolUsage(params.config.tools)) {
                        const headers = (_c = (_b = params.config.httpOptions) === null || _b === void 0 ? void 0 : _b.headers) !== null && _c !== void 0 ? _c : {};
                        let newHeaders = Object.assign({}, headers);
                        if (Object.keys(newHeaders).length === 0) newHeaders = this.apiClient.getDefaultHeaders();
                        setMcpUsageHeader(newHeaders);
                        newParams.config.httpOptions = Object.assign(Object.assign({}, params.config.httpOptions), {
                            headers: newHeaders
                        });
                    }
                    return newParams;
                }
                async initAfcToolsMap(params) {
                    var _a, _b, _c;
                    const afcTools = new Map();
                    for (const tool of (_b = (_a = params.config) === null || _a === void 0 ? void 0 : _a.tools) !== null && _b !== void 0 ? _b : [])if (isCallableTool(tool)) {
                        const callableTool = tool;
                        const toolDeclaration = await callableTool.tool();
                        for (const declaration of (_c = toolDeclaration.functionDeclarations) !== null && _c !== void 0 ? _c : []){
                            if (!declaration.name) throw new Error('Function declaration name is required.');
                            if (afcTools.has(declaration.name)) throw new Error(`Duplicate tool declaration name: ${declaration.name}`);
                            afcTools.set(declaration.name, callableTool);
                        }
                    }
                    return afcTools;
                }
                async processAfcStream(params) {
                    var _a, _b, _c;
                    const maxRemoteCalls = (_c = (_b = (_a = params.config) === null || _a === void 0 ? void 0 : _a.automaticFunctionCalling) === null || _b === void 0 ? void 0 : _b.maximumRemoteCalls) !== null && _c !== void 0 ? _c : DEFAULT_MAX_REMOTE_CALLS;
                    let wereFunctionsCalled = false;
                    let remoteCallCount = 0;
                    const afcToolsMap = await this.initAfcToolsMap(params);
                    return function(models, afcTools, params) {
                        return __asyncGenerator(this, arguments, function*() {
                            var _a, e_1, _b, _c;
                            var _d, _e;
                            while(remoteCallCount < maxRemoteCalls){
                                if (wereFunctionsCalled) {
                                    remoteCallCount++;
                                    wereFunctionsCalled = false;
                                }
                                const transformedParams = yield __await(models.processParamsMaybeAddMcpUsage(params));
                                const response = yield __await(models.generateContentStreamInternal(transformedParams));
                                const functionResponses = [];
                                const responseContents = [];
                                try {
                                    for(var _f = true, response_1 = (e_1 = void 0, __asyncValues(response)), response_1_1; response_1_1 = yield __await(response_1.next()), _a = response_1_1.done, !_a; _f = true){
                                        _c = response_1_1.value;
                                        _f = false;
                                        const chunk = _c;
                                        yield yield __await(chunk);
                                        if (chunk.candidates && ((_d = chunk.candidates[0]) === null || _d === void 0 ? void 0 : _d.content)) {
                                            responseContents.push(chunk.candidates[0].content);
                                            for (const part of (_e = chunk.candidates[0].content.parts) !== null && _e !== void 0 ? _e : [])if (remoteCallCount < maxRemoteCalls && part.functionCall) {
                                                if (!part.functionCall.name) throw new Error('Function call name was not returned by the model.');
                                                if (!afcTools.has(part.functionCall.name)) throw new Error(`Automatic function calling was requested, but not all the tools the model used implement the CallableTool interface. Available tools: ${afcTools.keys()}, mising tool: ${part.functionCall.name}`);
                                                else {
                                                    const responseParts = yield __await(afcTools.get(part.functionCall.name).callTool([
                                                        part.functionCall
                                                    ]));
                                                    functionResponses.push(...responseParts);
                                                }
                                            }
                                        }
                                    }
                                } catch (e_1_1) {
                                    e_1 = {
                                        error: e_1_1
                                    };
                                } finally{
                                    try {
                                        if (!_f && !_a && (_b = response_1.return)) yield __await(_b.call(response_1));
                                    } finally{
                                        if (e_1) throw e_1.error;
                                    }
                                }
                                if (functionResponses.length > 0) {
                                    wereFunctionsCalled = true;
                                    const typedResponseChunk = new GenerateContentResponse();
                                    typedResponseChunk.candidates = [
                                        {
                                            content: {
                                                role: 'user',
                                                parts: functionResponses
                                            }
                                        }
                                    ];
                                    yield yield __await(typedResponseChunk);
                                    const newContents = [];
                                    newContents.push(...responseContents);
                                    newContents.push({
                                        role: 'user',
                                        parts: functionResponses
                                    });
                                    const updatedContents = tContents(params.contents).concat(newContents);
                                    params.contents = updatedContents;
                                } else break;
                            }
                        });
                    }(this, afcToolsMap, params);
                }
                async generateContentInternal(params) {
                    var _a, _b, _c, _d;
                    let response;
                    let path = '';
                    let queryParams = {};
                    if (this.apiClient.isVertexAI()) {
                        const body = generateContentParametersToVertex(this.apiClient, params);
                        path = formatMap('{model}:generateContent', body['_url']);
                        queryParams = body['_query'];
                        delete body['_url'];
                        delete body['_query'];
                        response = this.apiClient.request({
                            path: path,
                            queryParams: queryParams,
                            body: JSON.stringify(body),
                            httpMethod: 'POST',
                            httpOptions: (_a = params.config) === null || _a === void 0 ? void 0 : _a.httpOptions,
                            abortSignal: (_b = params.config) === null || _b === void 0 ? void 0 : _b.abortSignal
                        }).then((httpResponse)=>{
                            return httpResponse.json().then((jsonResponse)=>{
                                const response = jsonResponse;
                                response.sdkHttpResponse = {
                                    headers: httpResponse.headers
                                };
                                return response;
                            });
                        });
                        return response.then((apiResponse)=>{
                            const resp = generateContentResponseFromVertex(apiResponse);
                            const typedResp = new GenerateContentResponse();
                            Object.assign(typedResp, resp);
                            return typedResp;
                        });
                    } else {
                        const body = generateContentParametersToMldev(this.apiClient, params);
                        path = formatMap('{model}:generateContent', body['_url']);
                        queryParams = body['_query'];
                        delete body['_url'];
                        delete body['_query'];
                        response = this.apiClient.request({
                            path: path,
                            queryParams: queryParams,
                            body: JSON.stringify(body),
                            httpMethod: 'POST',
                            httpOptions: (_c = params.config) === null || _c === void 0 ? void 0 : _c.httpOptions,
                            abortSignal: (_d = params.config) === null || _d === void 0 ? void 0 : _d.abortSignal
                        }).then((httpResponse)=>{
                            return httpResponse.json().then((jsonResponse)=>{
                                const response = jsonResponse;
                                response.sdkHttpResponse = {
                                    headers: httpResponse.headers
                                };
                                return response;
                            });
                        });
                        return response.then((apiResponse)=>{
                            const resp = generateContentResponseFromMldev(apiResponse);
                            const typedResp = new GenerateContentResponse();
                            Object.assign(typedResp, resp);
                            return typedResp;
                        });
                    }
                }
                async generateContentStreamInternal(params) {
                    var _a, _b, _c, _d;
                    let response;
                    let path = '';
                    let queryParams = {};
                    if (this.apiClient.isVertexAI()) {
                        const body = generateContentParametersToVertex(this.apiClient, params);
                        path = formatMap('{model}:streamGenerateContent?alt=sse', body['_url']);
                        queryParams = body['_query'];
                        delete body['_url'];
                        delete body['_query'];
                        const apiClient = this.apiClient;
                        response = apiClient.requestStream({
                            path: path,
                            queryParams: queryParams,
                            body: JSON.stringify(body),
                            httpMethod: 'POST',
                            httpOptions: (_a = params.config) === null || _a === void 0 ? void 0 : _a.httpOptions,
                            abortSignal: (_b = params.config) === null || _b === void 0 ? void 0 : _b.abortSignal
                        });
                        return response.then(function(apiResponse) {
                            return __asyncGenerator(this, arguments, function*() {
                                var _a, e_2, _b, _c;
                                try {
                                    for(var _d = true, apiResponse_1 = __asyncValues(apiResponse), apiResponse_1_1; apiResponse_1_1 = yield __await(apiResponse_1.next()), _a = apiResponse_1_1.done, !_a; _d = true){
                                        _c = apiResponse_1_1.value;
                                        _d = false;
                                        const chunk = _c;
                                        const resp = generateContentResponseFromVertex((yield __await(chunk.json())));
                                        resp['sdkHttpResponse'] = {
                                            headers: chunk.headers
                                        };
                                        const typedResp = new GenerateContentResponse();
                                        Object.assign(typedResp, resp);
                                        yield yield __await(typedResp);
                                    }
                                } catch (e_2_1) {
                                    e_2 = {
                                        error: e_2_1
                                    };
                                } finally{
                                    try {
                                        if (!_d && !_a && (_b = apiResponse_1.return)) yield __await(_b.call(apiResponse_1));
                                    } finally{
                                        if (e_2) throw e_2.error;
                                    }
                                }
                            });
                        });
                    } else {
                        const body = generateContentParametersToMldev(this.apiClient, params);
                        path = formatMap('{model}:streamGenerateContent?alt=sse', body['_url']);
                        queryParams = body['_query'];
                        delete body['_url'];
                        delete body['_query'];
                        const apiClient = this.apiClient;
                        response = apiClient.requestStream({
                            path: path,
                            queryParams: queryParams,
                            body: JSON.stringify(body),
                            httpMethod: 'POST',
                            httpOptions: (_c = params.config) === null || _c === void 0 ? void 0 : _c.httpOptions,
                            abortSignal: (_d = params.config) === null || _d === void 0 ? void 0 : _d.abortSignal
                        });
                        return response.then(function(apiResponse) {
                            return __asyncGenerator(this, arguments, function*() {
                                var _a, e_3, _b, _c;
                                try {
                                    for(var _d = true, apiResponse_2 = __asyncValues(apiResponse), apiResponse_2_1; apiResponse_2_1 = yield __await(apiResponse_2.next()), _a = apiResponse_2_1.done, !_a; _d = true){
                                        _c = apiResponse_2_1.value;
                                        _d = false;
                                        const chunk = _c;
                                        const resp = generateContentResponseFromMldev((yield __await(chunk.json())));
                                        resp['sdkHttpResponse'] = {
                                            headers: chunk.headers
                                        };
                                        const typedResp = new GenerateContentResponse();
                                        Object.assign(typedResp, resp);
                                        yield yield __await(typedResp);
                                    }
                                } catch (e_3_1) {
                                    e_3 = {
                                        error: e_3_1
                                    };
                                } finally{
                                    try {
                                        if (!_d && !_a && (_b = apiResponse_2.return)) yield __await(_b.call(apiResponse_2));
                                    } finally{
                                        if (e_3) throw e_3.error;
                                    }
                                }
                            });
                        });
                    }
                }
                async embedContent(params) {
                    var _a, _b, _c, _d;
                    let response;
                    let path = '';
                    let queryParams = {};
                    if (this.apiClient.isVertexAI()) {
                        const body = embedContentParametersToVertex(this.apiClient, params);
                        path = formatMap('{model}:predict', body['_url']);
                        queryParams = body['_query'];
                        delete body['_url'];
                        delete body['_query'];
                        response = this.apiClient.request({
                            path: path,
                            queryParams: queryParams,
                            body: JSON.stringify(body),
                            httpMethod: 'POST',
                            httpOptions: (_a = params.config) === null || _a === void 0 ? void 0 : _a.httpOptions,
                            abortSignal: (_b = params.config) === null || _b === void 0 ? void 0 : _b.abortSignal
                        }).then((httpResponse)=>{
                            return httpResponse.json().then((jsonResponse)=>{
                                const response = jsonResponse;
                                response.sdkHttpResponse = {
                                    headers: httpResponse.headers
                                };
                                return response;
                            });
                        });
                        return response.then((apiResponse)=>{
                            const resp = embedContentResponseFromVertex(apiResponse);
                            const typedResp = new EmbedContentResponse();
                            Object.assign(typedResp, resp);
                            return typedResp;
                        });
                    } else {
                        const body = embedContentParametersToMldev(this.apiClient, params);
                        path = formatMap('{model}:batchEmbedContents', body['_url']);
                        queryParams = body['_query'];
                        delete body['_url'];
                        delete body['_query'];
                        response = this.apiClient.request({
                            path: path,
                            queryParams: queryParams,
                            body: JSON.stringify(body),
                            httpMethod: 'POST',
                            httpOptions: (_c = params.config) === null || _c === void 0 ? void 0 : _c.httpOptions,
                            abortSignal: (_d = params.config) === null || _d === void 0 ? void 0 : _d.abortSignal
                        }).then((httpResponse)=>{
                            return httpResponse.json().then((jsonResponse)=>{
                                const response = jsonResponse;
                                response.sdkHttpResponse = {
                                    headers: httpResponse.headers
                                };
                                return response;
                            });
                        });
                        return response.then((apiResponse)=>{
                            const resp = embedContentResponseFromMldev(apiResponse);
                            const typedResp = new EmbedContentResponse();
                            Object.assign(typedResp, resp);
                            return typedResp;
                        });
                    }
                }
                async generateImagesInternal(params) {
                    var _a, _b, _c, _d;
                    let response;
                    let path = '';
                    let queryParams = {};
                    if (this.apiClient.isVertexAI()) {
                        const body = generateImagesParametersToVertex(this.apiClient, params);
                        path = formatMap('{model}:predict', body['_url']);
                        queryParams = body['_query'];
                        delete body['_url'];
                        delete body['_query'];
                        response = this.apiClient.request({
                            path: path,
                            queryParams: queryParams,
                            body: JSON.stringify(body),
                            httpMethod: 'POST',
                            httpOptions: (_a = params.config) === null || _a === void 0 ? void 0 : _a.httpOptions,
                            abortSignal: (_b = params.config) === null || _b === void 0 ? void 0 : _b.abortSignal
                        }).then((httpResponse)=>{
                            return httpResponse.json().then((jsonResponse)=>{
                                const response = jsonResponse;
                                response.sdkHttpResponse = {
                                    headers: httpResponse.headers
                                };
                                return response;
                            });
                        });
                        return response.then((apiResponse)=>{
                            const resp = generateImagesResponseFromVertex(apiResponse);
                            const typedResp = new GenerateImagesResponse();
                            Object.assign(typedResp, resp);
                            return typedResp;
                        });
                    } else {
                        const body = generateImagesParametersToMldev(this.apiClient, params);
                        path = formatMap('{model}:predict', body['_url']);
                        queryParams = body['_query'];
                        delete body['_url'];
                        delete body['_query'];
                        response = this.apiClient.request({
                            path: path,
                            queryParams: queryParams,
                            body: JSON.stringify(body),
                            httpMethod: 'POST',
                            httpOptions: (_c = params.config) === null || _c === void 0 ? void 0 : _c.httpOptions,
                            abortSignal: (_d = params.config) === null || _d === void 0 ? void 0 : _d.abortSignal
                        }).then((httpResponse)=>{
                            return httpResponse.json().then((jsonResponse)=>{
                                const response = jsonResponse;
                                response.sdkHttpResponse = {
                                    headers: httpResponse.headers
                                };
                                return response;
                            });
                        });
                        return response.then((apiResponse)=>{
                            const resp = generateImagesResponseFromMldev(apiResponse);
                            const typedResp = new GenerateImagesResponse();
                            Object.assign(typedResp, resp);
                            return typedResp;
                        });
                    }
                }
                async editImageInternal(params) {
                    var _a, _b;
                    let response;
                    let path = '';
                    let queryParams = {};
                    if (this.apiClient.isVertexAI()) {
                        const body = editImageParametersInternalToVertex(this.apiClient, params);
                        path = formatMap('{model}:predict', body['_url']);
                        queryParams = body['_query'];
                        delete body['_url'];
                        delete body['_query'];
                        response = this.apiClient.request({
                            path: path,
                            queryParams: queryParams,
                            body: JSON.stringify(body),
                            httpMethod: 'POST',
                            httpOptions: (_a = params.config) === null || _a === void 0 ? void 0 : _a.httpOptions,
                            abortSignal: (_b = params.config) === null || _b === void 0 ? void 0 : _b.abortSignal
                        }).then((httpResponse)=>{
                            return httpResponse.json().then((jsonResponse)=>{
                                const response = jsonResponse;
                                response.sdkHttpResponse = {
                                    headers: httpResponse.headers
                                };
                                return response;
                            });
                        });
                        return response.then((apiResponse)=>{
                            const resp = editImageResponseFromVertex(apiResponse);
                            const typedResp = new EditImageResponse();
                            Object.assign(typedResp, resp);
                            return typedResp;
                        });
                    } else throw new Error('This method is only supported by the Vertex AI.');
                }
                async upscaleImageInternal(params) {
                    var _a, _b;
                    let response;
                    let path = '';
                    let queryParams = {};
                    if (this.apiClient.isVertexAI()) {
                        const body = upscaleImageAPIParametersInternalToVertex(this.apiClient, params);
                        path = formatMap('{model}:predict', body['_url']);
                        queryParams = body['_query'];
                        delete body['_url'];
                        delete body['_query'];
                        response = this.apiClient.request({
                            path: path,
                            queryParams: queryParams,
                            body: JSON.stringify(body),
                            httpMethod: 'POST',
                            httpOptions: (_a = params.config) === null || _a === void 0 ? void 0 : _a.httpOptions,
                            abortSignal: (_b = params.config) === null || _b === void 0 ? void 0 : _b.abortSignal
                        }).then((httpResponse)=>{
                            return httpResponse.json().then((jsonResponse)=>{
                                const response = jsonResponse;
                                response.sdkHttpResponse = {
                                    headers: httpResponse.headers
                                };
                                return response;
                            });
                        });
                        return response.then((apiResponse)=>{
                            const resp = upscaleImageResponseFromVertex(apiResponse);
                            const typedResp = new UpscaleImageResponse();
                            Object.assign(typedResp, resp);
                            return typedResp;
                        });
                    } else throw new Error('This method is only supported by the Vertex AI.');
                }
                async recontextImage(params) {
                    var _a, _b;
                    let response;
                    let path = '';
                    let queryParams = {};
                    if (this.apiClient.isVertexAI()) {
                        const body = recontextImageParametersToVertex(this.apiClient, params);
                        path = formatMap('{model}:predict', body['_url']);
                        queryParams = body['_query'];
                        delete body['_url'];
                        delete body['_query'];
                        response = this.apiClient.request({
                            path: path,
                            queryParams: queryParams,
                            body: JSON.stringify(body),
                            httpMethod: 'POST',
                            httpOptions: (_a = params.config) === null || _a === void 0 ? void 0 : _a.httpOptions,
                            abortSignal: (_b = params.config) === null || _b === void 0 ? void 0 : _b.abortSignal
                        }).then((httpResponse)=>{
                            return httpResponse.json();
                        });
                        return response.then((apiResponse)=>{
                            const resp = recontextImageResponseFromVertex(apiResponse);
                            const typedResp = new RecontextImageResponse();
                            Object.assign(typedResp, resp);
                            return typedResp;
                        });
                    } else throw new Error('This method is only supported by the Vertex AI.');
                }
                async segmentImage(params) {
                    var _a, _b;
                    let response;
                    let path = '';
                    let queryParams = {};
                    if (this.apiClient.isVertexAI()) {
                        const body = segmentImageParametersToVertex(this.apiClient, params);
                        path = formatMap('{model}:predict', body['_url']);
                        queryParams = body['_query'];
                        delete body['_url'];
                        delete body['_query'];
                        response = this.apiClient.request({
                            path: path,
                            queryParams: queryParams,
                            body: JSON.stringify(body),
                            httpMethod: 'POST',
                            httpOptions: (_a = params.config) === null || _a === void 0 ? void 0 : _a.httpOptions,
                            abortSignal: (_b = params.config) === null || _b === void 0 ? void 0 : _b.abortSignal
                        }).then((httpResponse)=>{
                            return httpResponse.json();
                        });
                        return response.then((apiResponse)=>{
                            const resp = segmentImageResponseFromVertex(apiResponse);
                            const typedResp = new SegmentImageResponse();
                            Object.assign(typedResp, resp);
                            return typedResp;
                        });
                    } else throw new Error('This method is only supported by the Vertex AI.');
                }
                async get(params) {
                    var _a, _b, _c, _d;
                    let response;
                    let path = '';
                    let queryParams = {};
                    if (this.apiClient.isVertexAI()) {
                        const body = getModelParametersToVertex(this.apiClient, params);
                        path = formatMap('{name}', body['_url']);
                        queryParams = body['_query'];
                        delete body['_url'];
                        delete body['_query'];
                        response = this.apiClient.request({
                            path: path,
                            queryParams: queryParams,
                            body: JSON.stringify(body),
                            httpMethod: 'GET',
                            httpOptions: (_a = params.config) === null || _a === void 0 ? void 0 : _a.httpOptions,
                            abortSignal: (_b = params.config) === null || _b === void 0 ? void 0 : _b.abortSignal
                        }).then((httpResponse)=>{
                            return httpResponse.json();
                        });
                        return response.then((apiResponse)=>{
                            const resp = modelFromVertex(apiResponse);
                            return resp;
                        });
                    } else {
                        const body = getModelParametersToMldev(this.apiClient, params);
                        path = formatMap('{name}', body['_url']);
                        queryParams = body['_query'];
                        delete body['_url'];
                        delete body['_query'];
                        response = this.apiClient.request({
                            path: path,
                            queryParams: queryParams,
                            body: JSON.stringify(body),
                            httpMethod: 'GET',
                            httpOptions: (_c = params.config) === null || _c === void 0 ? void 0 : _c.httpOptions,
                            abortSignal: (_d = params.config) === null || _d === void 0 ? void 0 : _d.abortSignal
                        }).then((httpResponse)=>{
                            return httpResponse.json();
                        });
                        return response.then((apiResponse)=>{
                            const resp = modelFromMldev(apiResponse);
                            return resp;
                        });
                    }
                }
                async listInternal(params) {
                    var _a, _b, _c, _d;
                    let response;
                    let path = '';
                    let queryParams = {};
                    if (this.apiClient.isVertexAI()) {
                        const body = listModelsParametersToVertex(this.apiClient, params);
                        path = formatMap('{models_url}', body['_url']);
                        queryParams = body['_query'];
                        delete body['_url'];
                        delete body['_query'];
                        response = this.apiClient.request({
                            path: path,
                            queryParams: queryParams,
                            body: JSON.stringify(body),
                            httpMethod: 'GET',
                            httpOptions: (_a = params.config) === null || _a === void 0 ? void 0 : _a.httpOptions,
                            abortSignal: (_b = params.config) === null || _b === void 0 ? void 0 : _b.abortSignal
                        }).then((httpResponse)=>{
                            return httpResponse.json().then((jsonResponse)=>{
                                const response = jsonResponse;
                                response.sdkHttpResponse = {
                                    headers: httpResponse.headers
                                };
                                return response;
                            });
                        });
                        return response.then((apiResponse)=>{
                            const resp = listModelsResponseFromVertex(apiResponse);
                            const typedResp = new ListModelsResponse();
                            Object.assign(typedResp, resp);
                            return typedResp;
                        });
                    } else {
                        const body = listModelsParametersToMldev(this.apiClient, params);
                        path = formatMap('{models_url}', body['_url']);
                        queryParams = body['_query'];
                        delete body['_url'];
                        delete body['_query'];
                        response = this.apiClient.request({
                            path: path,
                            queryParams: queryParams,
                            body: JSON.stringify(body),
                            httpMethod: 'GET',
                            httpOptions: (_c = params.config) === null || _c === void 0 ? void 0 : _c.httpOptions,
                            abortSignal: (_d = params.config) === null || _d === void 0 ? void 0 : _d.abortSignal
                        }).then((httpResponse)=>{
                            return httpResponse.json().then((jsonResponse)=>{
                                const response = jsonResponse;
                                response.sdkHttpResponse = {
                                    headers: httpResponse.headers
                                };
                                return response;
                            });
                        });
                        return response.then((apiResponse)=>{
                            const resp = listModelsResponseFromMldev(apiResponse);
                            const typedResp = new ListModelsResponse();
                            Object.assign(typedResp, resp);
                            return typedResp;
                        });
                    }
                }
                async update(params) {
                    var _a, _b, _c, _d;
                    let response;
                    let path = '';
                    let queryParams = {};
                    if (this.apiClient.isVertexAI()) {
                        const body = updateModelParametersToVertex(this.apiClient, params);
                        path = formatMap('{model}', body['_url']);
                        queryParams = body['_query'];
                        delete body['_url'];
                        delete body['_query'];
                        response = this.apiClient.request({
                            path: path,
                            queryParams: queryParams,
                            body: JSON.stringify(body),
                            httpMethod: 'PATCH',
                            httpOptions: (_a = params.config) === null || _a === void 0 ? void 0 : _a.httpOptions,
                            abortSignal: (_b = params.config) === null || _b === void 0 ? void 0 : _b.abortSignal
                        }).then((httpResponse)=>{
                            return httpResponse.json();
                        });
                        return response.then((apiResponse)=>{
                            const resp = modelFromVertex(apiResponse);
                            return resp;
                        });
                    } else {
                        const body = updateModelParametersToMldev(this.apiClient, params);
                        path = formatMap('{name}', body['_url']);
                        queryParams = body['_query'];
                        delete body['_url'];
                        delete body['_query'];
                        response = this.apiClient.request({
                            path: path,
                            queryParams: queryParams,
                            body: JSON.stringify(body),
                            httpMethod: 'PATCH',
                            httpOptions: (_c = params.config) === null || _c === void 0 ? void 0 : _c.httpOptions,
                            abortSignal: (_d = params.config) === null || _d === void 0 ? void 0 : _d.abortSignal
                        }).then((httpResponse)=>{
                            return httpResponse.json();
                        });
                        return response.then((apiResponse)=>{
                            const resp = modelFromMldev(apiResponse);
                            return resp;
                        });
                    }
                }
                async delete(params) {
                    var _a, _b, _c, _d;
                    let response;
                    let path = '';
                    let queryParams = {};
                    if (this.apiClient.isVertexAI()) {
                        const body = deleteModelParametersToVertex(this.apiClient, params);
                        path = formatMap('{name}', body['_url']);
                        queryParams = body['_query'];
                        delete body['_url'];
                        delete body['_query'];
                        response = this.apiClient.request({
                            path: path,
                            queryParams: queryParams,
                            body: JSON.stringify(body),
                            httpMethod: 'DELETE',
                            httpOptions: (_a = params.config) === null || _a === void 0 ? void 0 : _a.httpOptions,
                            abortSignal: (_b = params.config) === null || _b === void 0 ? void 0 : _b.abortSignal
                        }).then((httpResponse)=>{
                            return httpResponse.json().then((jsonResponse)=>{
                                const response = jsonResponse;
                                response.sdkHttpResponse = {
                                    headers: httpResponse.headers
                                };
                                return response;
                            });
                        });
                        return response.then((apiResponse)=>{
                            const resp = deleteModelResponseFromVertex(apiResponse);
                            const typedResp = new DeleteModelResponse();
                            Object.assign(typedResp, resp);
                            return typedResp;
                        });
                    } else {
                        const body = deleteModelParametersToMldev(this.apiClient, params);
                        path = formatMap('{name}', body['_url']);
                        queryParams = body['_query'];
                        delete body['_url'];
                        delete body['_query'];
                        response = this.apiClient.request({
                            path: path,
                            queryParams: queryParams,
                            body: JSON.stringify(body),
                            httpMethod: 'DELETE',
                            httpOptions: (_c = params.config) === null || _c === void 0 ? void 0 : _c.httpOptions,
                            abortSignal: (_d = params.config) === null || _d === void 0 ? void 0 : _d.abortSignal
                        }).then((httpResponse)=>{
                            return httpResponse.json().then((jsonResponse)=>{
                                const response = jsonResponse;
                                response.sdkHttpResponse = {
                                    headers: httpResponse.headers
                                };
                                return response;
                            });
                        });
                        return response.then((apiResponse)=>{
                            const resp = deleteModelResponseFromMldev(apiResponse);
                            const typedResp = new DeleteModelResponse();
                            Object.assign(typedResp, resp);
                            return typedResp;
                        });
                    }
                }
                async countTokens(params) {
                    var _a, _b, _c, _d;
                    let response;
                    let path = '';
                    let queryParams = {};
                    if (this.apiClient.isVertexAI()) {
                        const body = countTokensParametersToVertex(this.apiClient, params);
                        path = formatMap('{model}:countTokens', body['_url']);
                        queryParams = body['_query'];
                        delete body['_url'];
                        delete body['_query'];
                        response = this.apiClient.request({
                            path: path,
                            queryParams: queryParams,
                            body: JSON.stringify(body),
                            httpMethod: 'POST',
                            httpOptions: (_a = params.config) === null || _a === void 0 ? void 0 : _a.httpOptions,
                            abortSignal: (_b = params.config) === null || _b === void 0 ? void 0 : _b.abortSignal
                        }).then((httpResponse)=>{
                            return httpResponse.json().then((jsonResponse)=>{
                                const response = jsonResponse;
                                response.sdkHttpResponse = {
                                    headers: httpResponse.headers
                                };
                                return response;
                            });
                        });
                        return response.then((apiResponse)=>{
                            const resp = countTokensResponseFromVertex(apiResponse);
                            const typedResp = new CountTokensResponse();
                            Object.assign(typedResp, resp);
                            return typedResp;
                        });
                    } else {
                        const body = countTokensParametersToMldev(this.apiClient, params);
                        path = formatMap('{model}:countTokens', body['_url']);
                        queryParams = body['_query'];
                        delete body['_url'];
                        delete body['_query'];
                        response = this.apiClient.request({
                            path: path,
                            queryParams: queryParams,
                            body: JSON.stringify(body),
                            httpMethod: 'POST',
                            httpOptions: (_c = params.config) === null || _c === void 0 ? void 0 : _c.httpOptions,
                            abortSignal: (_d = params.config) === null || _d === void 0 ? void 0 : _d.abortSignal
                        }).then((httpResponse)=>{
                            return httpResponse.json().then((jsonResponse)=>{
                                const response = jsonResponse;
                                response.sdkHttpResponse = {
                                    headers: httpResponse.headers
                                };
                                return response;
                            });
                        });
                        return response.then((apiResponse)=>{
                            const resp = countTokensResponseFromMldev(apiResponse);
                            const typedResp = new CountTokensResponse();
                            Object.assign(typedResp, resp);
                            return typedResp;
                        });
                    }
                }
                async computeTokens(params) {
                    var _a, _b;
                    let response;
                    let path = '';
                    let queryParams = {};
                    if (this.apiClient.isVertexAI()) {
                        const body = computeTokensParametersToVertex(this.apiClient, params);
                        path = formatMap('{model}:computeTokens', body['_url']);
                        queryParams = body['_query'];
                        delete body['_url'];
                        delete body['_query'];
                        response = this.apiClient.request({
                            path: path,
                            queryParams: queryParams,
                            body: JSON.stringify(body),
                            httpMethod: 'POST',
                            httpOptions: (_a = params.config) === null || _a === void 0 ? void 0 : _a.httpOptions,
                            abortSignal: (_b = params.config) === null || _b === void 0 ? void 0 : _b.abortSignal
                        }).then((httpResponse)=>{
                            return httpResponse.json().then((jsonResponse)=>{
                                const response = jsonResponse;
                                response.sdkHttpResponse = {
                                    headers: httpResponse.headers
                                };
                                return response;
                            });
                        });
                        return response.then((apiResponse)=>{
                            const resp = computeTokensResponseFromVertex(apiResponse);
                            const typedResp = new ComputeTokensResponse();
                            Object.assign(typedResp, resp);
                            return typedResp;
                        });
                    } else throw new Error('This method is only supported by the Vertex AI.');
                }
                async generateVideosInternal(params) {
                    var _a, _b, _c, _d;
                    let response;
                    let path = '';
                    let queryParams = {};
                    if (this.apiClient.isVertexAI()) {
                        const body = generateVideosParametersToVertex(this.apiClient, params);
                        path = formatMap('{model}:predictLongRunning', body['_url']);
                        queryParams = body['_query'];
                        delete body['_url'];
                        delete body['_query'];
                        response = this.apiClient.request({
                            path: path,
                            queryParams: queryParams,
                            body: JSON.stringify(body),
                            httpMethod: 'POST',
                            httpOptions: (_a = params.config) === null || _a === void 0 ? void 0 : _a.httpOptions,
                            abortSignal: (_b = params.config) === null || _b === void 0 ? void 0 : _b.abortSignal
                        }).then((httpResponse)=>{
                            return httpResponse.json();
                        });
                        return response.then((apiResponse)=>{
                            const resp = generateVideosOperationFromVertex(apiResponse);
                            const typedResp = new GenerateVideosOperation();
                            Object.assign(typedResp, resp);
                            return typedResp;
                        });
                    } else {
                        const body = generateVideosParametersToMldev(this.apiClient, params);
                        path = formatMap('{model}:predictLongRunning', body['_url']);
                        queryParams = body['_query'];
                        delete body['_url'];
                        delete body['_query'];
                        response = this.apiClient.request({
                            path: path,
                            queryParams: queryParams,
                            body: JSON.stringify(body),
                            httpMethod: 'POST',
                            httpOptions: (_c = params.config) === null || _c === void 0 ? void 0 : _c.httpOptions,
                            abortSignal: (_d = params.config) === null || _d === void 0 ? void 0 : _d.abortSignal
                        }).then((httpResponse)=>{
                            return httpResponse.json();
                        });
                        return response.then((apiResponse)=>{
                            const resp = generateVideosOperationFromMldev(apiResponse);
                            const typedResp = new GenerateVideosOperation();
                            Object.assign(typedResp, resp);
                            return typedResp;
                        });
                    }
                }
            }
            class Operations extends BaseModule {
                constructor(apiClient){
                    super();
                    this.apiClient = apiClient;
                }
                async getVideosOperation(parameters) {
                    const operation = parameters.operation;
                    const config = parameters.config;
                    if (operation.name === undefined || operation.name === '') throw new Error('Operation name is required.');
                    if (this.apiClient.isVertexAI()) {
                        const resourceName = operation.name.split('/operations/')[0];
                        let httpOptions = undefined;
                        if (config && 'httpOptions' in config) httpOptions = config.httpOptions;
                        const rawOperation = await this.fetchPredictVideosOperationInternal({
                            operationName: operation.name,
                            resourceName: resourceName,
                            config: {
                                httpOptions: httpOptions
                            }
                        });
                        return operation._fromAPIResponse({
                            apiResponse: rawOperation,
                            _isVertexAI: true
                        });
                    } else {
                        const rawOperation = await this.getVideosOperationInternal({
                            operationName: operation.name,
                            config: config
                        });
                        return operation._fromAPIResponse({
                            apiResponse: rawOperation,
                            _isVertexAI: false
                        });
                    }
                }
                async get(parameters) {
                    const operation = parameters.operation;
                    const config = parameters.config;
                    if (operation.name === undefined || operation.name === '') throw new Error('Operation name is required.');
                    if (this.apiClient.isVertexAI()) {
                        const resourceName = operation.name.split('/operations/')[0];
                        let httpOptions = undefined;
                        if (config && 'httpOptions' in config) httpOptions = config.httpOptions;
                        const rawOperation = await this.fetchPredictVideosOperationInternal({
                            operationName: operation.name,
                            resourceName: resourceName,
                            config: {
                                httpOptions: httpOptions
                            }
                        });
                        return operation._fromAPIResponse({
                            apiResponse: rawOperation,
                            _isVertexAI: true
                        });
                    } else {
                        const rawOperation = await this.getVideosOperationInternal({
                            operationName: operation.name,
                            config: config
                        });
                        return operation._fromAPIResponse({
                            apiResponse: rawOperation,
                            _isVertexAI: false
                        });
                    }
                }
                async getVideosOperationInternal(params) {
                    var _a, _b, _c, _d;
                    let response;
                    let path = '';
                    let queryParams = {};
                    if (this.apiClient.isVertexAI()) {
                        const body = getOperationParametersToVertex(params);
                        path = formatMap('{operationName}', body['_url']);
                        queryParams = body['_query'];
                        delete body['_url'];
                        delete body['_query'];
                        response = this.apiClient.request({
                            path: path,
                            queryParams: queryParams,
                            body: JSON.stringify(body),
                            httpMethod: 'GET',
                            httpOptions: (_a = params.config) === null || _a === void 0 ? void 0 : _a.httpOptions,
                            abortSignal: (_b = params.config) === null || _b === void 0 ? void 0 : _b.abortSignal
                        }).then((httpResponse)=>{
                            return httpResponse.json();
                        });
                        return response;
                    } else {
                        const body = getOperationParametersToMldev(params);
                        path = formatMap('{operationName}', body['_url']);
                        queryParams = body['_query'];
                        delete body['_url'];
                        delete body['_query'];
                        response = this.apiClient.request({
                            path: path,
                            queryParams: queryParams,
                            body: JSON.stringify(body),
                            httpMethod: 'GET',
                            httpOptions: (_c = params.config) === null || _c === void 0 ? void 0 : _c.httpOptions,
                            abortSignal: (_d = params.config) === null || _d === void 0 ? void 0 : _d.abortSignal
                        }).then((httpResponse)=>{
                            return httpResponse.json();
                        });
                        return response;
                    }
                }
                async fetchPredictVideosOperationInternal(params) {
                    var _a, _b;
                    let response;
                    let path = '';
                    let queryParams = {};
                    if (this.apiClient.isVertexAI()) {
                        const body = fetchPredictOperationParametersToVertex(params);
                        path = formatMap('{resourceName}:fetchPredictOperation', body['_url']);
                        queryParams = body['_query'];
                        delete body['_url'];
                        delete body['_query'];
                        response = this.apiClient.request({
                            path: path,
                            queryParams: queryParams,
                            body: JSON.stringify(body),
                            httpMethod: 'POST',
                            httpOptions: (_a = params.config) === null || _a === void 0 ? void 0 : _a.httpOptions,
                            abortSignal: (_b = params.config) === null || _b === void 0 ? void 0 : _b.abortSignal
                        }).then((httpResponse)=>{
                            return httpResponse.json();
                        });
                        return response;
                    } else throw new Error('This method is only supported by the Vertex AI.');
                }
            }
            function blobToMldev(fromObject) {
                const toObject = {};
                const fromData = getValueByPath(fromObject, [
                    'data'
                ]);
                if (fromData != null) setValueByPath(toObject, [
                    'data'
                ], fromData);
                if (getValueByPath(fromObject, [
                    'displayName'
                ]) !== undefined) throw new Error('displayName parameter is not supported in Gemini API.');
                const fromMimeType = getValueByPath(fromObject, [
                    'mimeType'
                ]);
                if (fromMimeType != null) setValueByPath(toObject, [
                    'mimeType'
                ], fromMimeType);
                return toObject;
            }
            function contentToMldev(fromObject) {
                const toObject = {};
                const fromParts = getValueByPath(fromObject, [
                    'parts'
                ]);
                if (fromParts != null) {
                    let transformedList = fromParts;
                    if (Array.isArray(transformedList)) transformedList = transformedList.map((item)=>{
                        return partToMldev(item);
                    });
                    setValueByPath(toObject, [
                        'parts'
                    ], transformedList);
                }
                const fromRole = getValueByPath(fromObject, [
                    'role'
                ]);
                if (fromRole != null) setValueByPath(toObject, [
                    'role'
                ], fromRole);
                return toObject;
            }
            function createAuthTokenConfigToMldev(apiClient, fromObject, parentObject) {
                const toObject = {};
                const fromExpireTime = getValueByPath(fromObject, [
                    'expireTime'
                ]);
                if (parentObject !== undefined && fromExpireTime != null) setValueByPath(parentObject, [
                    'expireTime'
                ], fromExpireTime);
                const fromNewSessionExpireTime = getValueByPath(fromObject, [
                    'newSessionExpireTime'
                ]);
                if (parentObject !== undefined && fromNewSessionExpireTime != null) setValueByPath(parentObject, [
                    'newSessionExpireTime'
                ], fromNewSessionExpireTime);
                const fromUses = getValueByPath(fromObject, [
                    'uses'
                ]);
                if (parentObject !== undefined && fromUses != null) setValueByPath(parentObject, [
                    'uses'
                ], fromUses);
                const fromLiveConnectConstraints = getValueByPath(fromObject, [
                    'liveConnectConstraints'
                ]);
                if (parentObject !== undefined && fromLiveConnectConstraints != null) setValueByPath(parentObject, [
                    'bidiGenerateContentSetup'
                ], liveConnectConstraintsToMldev(apiClient, fromLiveConnectConstraints));
                const fromLockAdditionalFields = getValueByPath(fromObject, [
                    'lockAdditionalFields'
                ]);
                if (parentObject !== undefined && fromLockAdditionalFields != null) setValueByPath(parentObject, [
                    'fieldMask'
                ], fromLockAdditionalFields);
                return toObject;
            }
            function createAuthTokenParametersToMldev(apiClient, fromObject) {
                const toObject = {};
                const fromConfig = getValueByPath(fromObject, [
                    'config'
                ]);
                if (fromConfig != null) setValueByPath(toObject, [
                    'config'
                ], createAuthTokenConfigToMldev(apiClient, fromConfig, toObject));
                return toObject;
            }
            function fileDataToMldev(fromObject) {
                const toObject = {};
                if (getValueByPath(fromObject, [
                    'displayName'
                ]) !== undefined) throw new Error('displayName parameter is not supported in Gemini API.');
                const fromFileUri = getValueByPath(fromObject, [
                    'fileUri'
                ]);
                if (fromFileUri != null) setValueByPath(toObject, [
                    'fileUri'
                ], fromFileUri);
                const fromMimeType = getValueByPath(fromObject, [
                    'mimeType'
                ]);
                if (fromMimeType != null) setValueByPath(toObject, [
                    'mimeType'
                ], fromMimeType);
                return toObject;
            }
            function functionCallToMldev(fromObject) {
                const toObject = {};
                const fromId = getValueByPath(fromObject, [
                    'id'
                ]);
                if (fromId != null) setValueByPath(toObject, [
                    'id'
                ], fromId);
                const fromArgs = getValueByPath(fromObject, [
                    'args'
                ]);
                if (fromArgs != null) setValueByPath(toObject, [
                    'args'
                ], fromArgs);
                const fromName = getValueByPath(fromObject, [
                    'name'
                ]);
                if (fromName != null) setValueByPath(toObject, [
                    'name'
                ], fromName);
                if (getValueByPath(fromObject, [
                    'partialArgs'
                ]) !== undefined) throw new Error('partialArgs parameter is not supported in Gemini API.');
                if (getValueByPath(fromObject, [
                    'willContinue'
                ]) !== undefined) throw new Error('willContinue parameter is not supported in Gemini API.');
                return toObject;
            }
            function googleMapsToMldev(fromObject) {
                const toObject = {};
                if (getValueByPath(fromObject, [
                    'authConfig'
                ]) !== undefined) throw new Error('authConfig parameter is not supported in Gemini API.');
                const fromEnableWidget = getValueByPath(fromObject, [
                    'enableWidget'
                ]);
                if (fromEnableWidget != null) setValueByPath(toObject, [
                    'enableWidget'
                ], fromEnableWidget);
                return toObject;
            }
            function googleSearchToMldev(fromObject) {
                const toObject = {};
                if (getValueByPath(fromObject, [
                    'excludeDomains'
                ]) !== undefined) throw new Error('excludeDomains parameter is not supported in Gemini API.');
                if (getValueByPath(fromObject, [
                    'blockingConfidence'
                ]) !== undefined) throw new Error('blockingConfidence parameter is not supported in Gemini API.');
                const fromTimeRangeFilter = getValueByPath(fromObject, [
                    'timeRangeFilter'
                ]);
                if (fromTimeRangeFilter != null) setValueByPath(toObject, [
                    'timeRangeFilter'
                ], fromTimeRangeFilter);
                return toObject;
            }
            function liveConnectConfigToMldev(fromObject, parentObject) {
                const toObject = {};
                const fromGenerationConfig = getValueByPath(fromObject, [
                    'generationConfig'
                ]);
                if (parentObject !== undefined && fromGenerationConfig != null) setValueByPath(parentObject, [
                    'setup',
                    'generationConfig'
                ], fromGenerationConfig);
                const fromResponseModalities = getValueByPath(fromObject, [
                    'responseModalities'
                ]);
                if (parentObject !== undefined && fromResponseModalities != null) setValueByPath(parentObject, [
                    'setup',
                    'generationConfig',
                    'responseModalities'
                ], fromResponseModalities);
                const fromTemperature = getValueByPath(fromObject, [
                    'temperature'
                ]);
                if (parentObject !== undefined && fromTemperature != null) setValueByPath(parentObject, [
                    'setup',
                    'generationConfig',
                    'temperature'
                ], fromTemperature);
                const fromTopP = getValueByPath(fromObject, [
                    'topP'
                ]);
                if (parentObject !== undefined && fromTopP != null) setValueByPath(parentObject, [
                    'setup',
                    'generationConfig',
                    'topP'
                ], fromTopP);
                const fromTopK = getValueByPath(fromObject, [
                    'topK'
                ]);
                if (parentObject !== undefined && fromTopK != null) setValueByPath(parentObject, [
                    'setup',
                    'generationConfig',
                    'topK'
                ], fromTopK);
                const fromMaxOutputTokens = getValueByPath(fromObject, [
                    'maxOutputTokens'
                ]);
                if (parentObject !== undefined && fromMaxOutputTokens != null) setValueByPath(parentObject, [
                    'setup',
                    'generationConfig',
                    'maxOutputTokens'
                ], fromMaxOutputTokens);
                const fromMediaResolution = getValueByPath(fromObject, [
                    'mediaResolution'
                ]);
                if (parentObject !== undefined && fromMediaResolution != null) setValueByPath(parentObject, [
                    'setup',
                    'generationConfig',
                    'mediaResolution'
                ], fromMediaResolution);
                const fromSeed = getValueByPath(fromObject, [
                    'seed'
                ]);
                if (parentObject !== undefined && fromSeed != null) setValueByPath(parentObject, [
                    'setup',
                    'generationConfig',
                    'seed'
                ], fromSeed);
                const fromSpeechConfig = getValueByPath(fromObject, [
                    'speechConfig'
                ]);
                if (parentObject !== undefined && fromSpeechConfig != null) setValueByPath(parentObject, [
                    'setup',
                    'generationConfig',
                    'speechConfig'
                ], tLiveSpeechConfig(fromSpeechConfig));
                const fromThinkingConfig = getValueByPath(fromObject, [
                    'thinkingConfig'
                ]);
                if (parentObject !== undefined && fromThinkingConfig != null) setValueByPath(parentObject, [
                    'setup',
                    'generationConfig',
                    'thinkingConfig'
                ], fromThinkingConfig);
                const fromEnableAffectiveDialog = getValueByPath(fromObject, [
                    'enableAffectiveDialog'
                ]);
                if (parentObject !== undefined && fromEnableAffectiveDialog != null) setValueByPath(parentObject, [
                    'setup',
                    'generationConfig',
                    'enableAffectiveDialog'
                ], fromEnableAffectiveDialog);
                const fromSystemInstruction = getValueByPath(fromObject, [
                    'systemInstruction'
                ]);
                if (parentObject !== undefined && fromSystemInstruction != null) setValueByPath(parentObject, [
                    'setup',
                    'systemInstruction'
                ], contentToMldev(tContent(fromSystemInstruction)));
                const fromTools = getValueByPath(fromObject, [
                    'tools'
                ]);
                if (parentObject !== undefined && fromTools != null) {
                    let transformedList = tTools(fromTools);
                    if (Array.isArray(transformedList)) transformedList = transformedList.map((item)=>{
                        return toolToMldev(tTool(item));
                    });
                    setValueByPath(parentObject, [
                        'setup',
                        'tools'
                    ], transformedList);
                }
                const fromSessionResumption = getValueByPath(fromObject, [
                    'sessionResumption'
                ]);
                if (parentObject !== undefined && fromSessionResumption != null) setValueByPath(parentObject, [
                    'setup',
                    'sessionResumption'
                ], sessionResumptionConfigToMldev(fromSessionResumption));
                const fromInputAudioTranscription = getValueByPath(fromObject, [
                    'inputAudioTranscription'
                ]);
                if (parentObject !== undefined && fromInputAudioTranscription != null) setValueByPath(parentObject, [
                    'setup',
                    'inputAudioTranscription'
                ], fromInputAudioTranscription);
                const fromOutputAudioTranscription = getValueByPath(fromObject, [
                    'outputAudioTranscription'
                ]);
                if (parentObject !== undefined && fromOutputAudioTranscription != null) setValueByPath(parentObject, [
                    'setup',
                    'outputAudioTranscription'
                ], fromOutputAudioTranscription);
                const fromRealtimeInputConfig = getValueByPath(fromObject, [
                    'realtimeInputConfig'
                ]);
                if (parentObject !== undefined && fromRealtimeInputConfig != null) setValueByPath(parentObject, [
                    'setup',
                    'realtimeInputConfig'
                ], fromRealtimeInputConfig);
                const fromContextWindowCompression = getValueByPath(fromObject, [
                    'contextWindowCompression'
                ]);
                if (parentObject !== undefined && fromContextWindowCompression != null) setValueByPath(parentObject, [
                    'setup',
                    'contextWindowCompression'
                ], fromContextWindowCompression);
                const fromProactivity = getValueByPath(fromObject, [
                    'proactivity'
                ]);
                if (parentObject !== undefined && fromProactivity != null) setValueByPath(parentObject, [
                    'setup',
                    'proactivity'
                ], fromProactivity);
                if (getValueByPath(fromObject, [
                    'explicitVadSignal'
                ]) !== undefined) throw new Error('explicitVadSignal parameter is not supported in Gemini API.');
                return toObject;
            }
            function liveConnectConstraintsToMldev(apiClient, fromObject) {
                const toObject = {};
                const fromModel = getValueByPath(fromObject, [
                    'model'
                ]);
                if (fromModel != null) setValueByPath(toObject, [
                    'setup',
                    'model'
                ], tModel(apiClient, fromModel));
                const fromConfig = getValueByPath(fromObject, [
                    'config'
                ]);
                if (fromConfig != null) setValueByPath(toObject, [
                    'config'
                ], liveConnectConfigToMldev(fromConfig, toObject));
                return toObject;
            }
            function partToMldev(fromObject) {
                const toObject = {};
                const fromMediaResolution = getValueByPath(fromObject, [
                    'mediaResolution'
                ]);
                if (fromMediaResolution != null) setValueByPath(toObject, [
                    'mediaResolution'
                ], fromMediaResolution);
                const fromCodeExecutionResult = getValueByPath(fromObject, [
                    'codeExecutionResult'
                ]);
                if (fromCodeExecutionResult != null) setValueByPath(toObject, [
                    'codeExecutionResult'
                ], fromCodeExecutionResult);
                const fromExecutableCode = getValueByPath(fromObject, [
                    'executableCode'
                ]);
                if (fromExecutableCode != null) setValueByPath(toObject, [
                    'executableCode'
                ], fromExecutableCode);
                const fromFileData = getValueByPath(fromObject, [
                    'fileData'
                ]);
                if (fromFileData != null) setValueByPath(toObject, [
                    'fileData'
                ], fileDataToMldev(fromFileData));
                const fromFunctionCall = getValueByPath(fromObject, [
                    'functionCall'
                ]);
                if (fromFunctionCall != null) setValueByPath(toObject, [
                    'functionCall'
                ], functionCallToMldev(fromFunctionCall));
                const fromFunctionResponse = getValueByPath(fromObject, [
                    'functionResponse'
                ]);
                if (fromFunctionResponse != null) setValueByPath(toObject, [
                    'functionResponse'
                ], fromFunctionResponse);
                const fromInlineData = getValueByPath(fromObject, [
                    'inlineData'
                ]);
                if (fromInlineData != null) setValueByPath(toObject, [
                    'inlineData'
                ], blobToMldev(fromInlineData));
                const fromText = getValueByPath(fromObject, [
                    'text'
                ]);
                if (fromText != null) setValueByPath(toObject, [
                    'text'
                ], fromText);
                const fromThought = getValueByPath(fromObject, [
                    'thought'
                ]);
                if (fromThought != null) setValueByPath(toObject, [
                    'thought'
                ], fromThought);
                const fromThoughtSignature = getValueByPath(fromObject, [
                    'thoughtSignature'
                ]);
                if (fromThoughtSignature != null) setValueByPath(toObject, [
                    'thoughtSignature'
                ], fromThoughtSignature);
                const fromVideoMetadata = getValueByPath(fromObject, [
                    'videoMetadata'
                ]);
                if (fromVideoMetadata != null) setValueByPath(toObject, [
                    'videoMetadata'
                ], fromVideoMetadata);
                return toObject;
            }
            function sessionResumptionConfigToMldev(fromObject) {
                const toObject = {};
                const fromHandle = getValueByPath(fromObject, [
                    'handle'
                ]);
                if (fromHandle != null) setValueByPath(toObject, [
                    'handle'
                ], fromHandle);
                if (getValueByPath(fromObject, [
                    'transparent'
                ]) !== undefined) throw new Error('transparent parameter is not supported in Gemini API.');
                return toObject;
            }
            function toolToMldev(fromObject) {
                const toObject = {};
                const fromFunctionDeclarations = getValueByPath(fromObject, [
                    'functionDeclarations'
                ]);
                if (fromFunctionDeclarations != null) {
                    let transformedList = fromFunctionDeclarations;
                    if (Array.isArray(transformedList)) transformedList = transformedList.map((item)=>{
                        return item;
                    });
                    setValueByPath(toObject, [
                        'functionDeclarations'
                    ], transformedList);
                }
                if (getValueByPath(fromObject, [
                    'retrieval'
                ]) !== undefined) throw new Error('retrieval parameter is not supported in Gemini API.');
                const fromGoogleSearchRetrieval = getValueByPath(fromObject, [
                    'googleSearchRetrieval'
                ]);
                if (fromGoogleSearchRetrieval != null) setValueByPath(toObject, [
                    'googleSearchRetrieval'
                ], fromGoogleSearchRetrieval);
                const fromComputerUse = getValueByPath(fromObject, [
                    'computerUse'
                ]);
                if (fromComputerUse != null) setValueByPath(toObject, [
                    'computerUse'
                ], fromComputerUse);
                const fromFileSearch = getValueByPath(fromObject, [
                    'fileSearch'
                ]);
                if (fromFileSearch != null) setValueByPath(toObject, [
                    'fileSearch'
                ], fromFileSearch);
                const fromCodeExecution = getValueByPath(fromObject, [
                    'codeExecution'
                ]);
                if (fromCodeExecution != null) setValueByPath(toObject, [
                    'codeExecution'
                ], fromCodeExecution);
                if (getValueByPath(fromObject, [
                    'enterpriseWebSearch'
                ]) !== undefined) throw new Error('enterpriseWebSearch parameter is not supported in Gemini API.');
                const fromGoogleMaps = getValueByPath(fromObject, [
                    'googleMaps'
                ]);
                if (fromGoogleMaps != null) setValueByPath(toObject, [
                    'googleMaps'
                ], googleMapsToMldev(fromGoogleMaps));
                const fromGoogleSearch = getValueByPath(fromObject, [
                    'googleSearch'
                ]);
                if (fromGoogleSearch != null) setValueByPath(toObject, [
                    'googleSearch'
                ], googleSearchToMldev(fromGoogleSearch));
                const fromUrlContext = getValueByPath(fromObject, [
                    'urlContext'
                ]);
                if (fromUrlContext != null) setValueByPath(toObject, [
                    'urlContext'
                ], fromUrlContext);
                return toObject;
            }
            function getFieldMasks(setup) {
                const fields = [];
                for(const key in setup)if (Object.prototype.hasOwnProperty.call(setup, key)) {
                    const value = setup[key];
                    if (typeof value === 'object' && value != null && Object.keys(value).length > 0) {
                        const field = Object.keys(value).map((kk)=>`${key}.${kk}`);
                        fields.push(...field);
                    } else fields.push(key);
                }
                return fields.join(',');
            }
            function convertBidiSetupToTokenSetup(requestDict, config) {
                let setupForMaskGeneration = null;
                const bidiGenerateContentSetupValue = requestDict['bidiGenerateContentSetup'];
                if (typeof bidiGenerateContentSetupValue === 'object' && bidiGenerateContentSetupValue !== null && 'setup' in bidiGenerateContentSetupValue) {
                    const innerSetup = bidiGenerateContentSetupValue.setup;
                    if (typeof innerSetup === 'object' && innerSetup !== null) {
                        requestDict['bidiGenerateContentSetup'] = innerSetup;
                        setupForMaskGeneration = innerSetup;
                    } else delete requestDict['bidiGenerateContentSetup'];
                } else if (bidiGenerateContentSetupValue !== undefined) delete requestDict['bidiGenerateContentSetup'];
                const preExistingFieldMask = requestDict['fieldMask'];
                if (setupForMaskGeneration) {
                    const generatedMaskFromBidi = getFieldMasks(setupForMaskGeneration);
                    if (Array.isArray(config === null || config === void 0 ? void 0 : config.lockAdditionalFields) && (config === null || config === void 0 ? void 0 : config.lockAdditionalFields.length) === 0) {
                        if (generatedMaskFromBidi) requestDict['fieldMask'] = generatedMaskFromBidi;
                        else delete requestDict['fieldMask'];
                    } else if ((config === null || config === void 0 ? void 0 : config.lockAdditionalFields) && config.lockAdditionalFields.length > 0 && preExistingFieldMask !== null && Array.isArray(preExistingFieldMask) && preExistingFieldMask.length > 0) {
                        const generationConfigFields = [
                            'temperature',
                            'topK',
                            'topP',
                            'maxOutputTokens',
                            'responseModalities',
                            'seed',
                            'speechConfig'
                        ];
                        let mappedFieldsFromPreExisting = [];
                        if (preExistingFieldMask.length > 0) mappedFieldsFromPreExisting = preExistingFieldMask.map((field)=>{
                            if (generationConfigFields.includes(field)) return `generationConfig.${field}`;
                            return field;
                        });
                        const finalMaskParts = [];
                        if (generatedMaskFromBidi) finalMaskParts.push(generatedMaskFromBidi);
                        if (mappedFieldsFromPreExisting.length > 0) finalMaskParts.push(...mappedFieldsFromPreExisting);
                        if (finalMaskParts.length > 0) requestDict['fieldMask'] = finalMaskParts.join(',');
                        else delete requestDict['fieldMask'];
                    } else delete requestDict['fieldMask'];
                } else if (preExistingFieldMask !== null && Array.isArray(preExistingFieldMask) && preExistingFieldMask.length > 0) requestDict['fieldMask'] = preExistingFieldMask.join(',');
                else delete requestDict['fieldMask'];
                return requestDict;
            }
            class Tokens extends BaseModule {
                constructor(apiClient){
                    super();
                    this.apiClient = apiClient;
                }
                async create(params) {
                    var _a, _b;
                    let response;
                    let path = '';
                    let queryParams = {};
                    if (this.apiClient.isVertexAI()) throw new Error('The client.tokens.create method is only supported by the Gemini Developer API.');
                    else {
                        const body = createAuthTokenParametersToMldev(this.apiClient, params);
                        path = formatMap('auth_tokens', body['_url']);
                        queryParams = body['_query'];
                        delete body['config'];
                        delete body['_url'];
                        delete body['_query'];
                        const transformedBody = convertBidiSetupToTokenSetup(body, params.config);
                        response = this.apiClient.request({
                            path: path,
                            queryParams: queryParams,
                            body: JSON.stringify(transformedBody),
                            httpMethod: 'POST',
                            httpOptions: (_a = params.config) === null || _a === void 0 ? void 0 : _a.httpOptions,
                            abortSignal: (_b = params.config) === null || _b === void 0 ? void 0 : _b.abortSignal
                        }).then((httpResponse)=>{
                            return httpResponse.json();
                        });
                        return response.then((resp)=>{
                            return resp;
                        });
                    }
                }
            }
            function deleteDocumentConfigToMldev(fromObject, parentObject) {
                const toObject = {};
                const fromForce = getValueByPath(fromObject, [
                    'force'
                ]);
                if (parentObject !== undefined && fromForce != null) setValueByPath(parentObject, [
                    '_query',
                    'force'
                ], fromForce);
                return toObject;
            }
            function deleteDocumentParametersToMldev(fromObject) {
                const toObject = {};
                const fromName = getValueByPath(fromObject, [
                    'name'
                ]);
                if (fromName != null) setValueByPath(toObject, [
                    '_url',
                    'name'
                ], fromName);
                const fromConfig = getValueByPath(fromObject, [
                    'config'
                ]);
                if (fromConfig != null) deleteDocumentConfigToMldev(fromConfig, toObject);
                return toObject;
            }
            function getDocumentParametersToMldev(fromObject) {
                const toObject = {};
                const fromName = getValueByPath(fromObject, [
                    'name'
                ]);
                if (fromName != null) setValueByPath(toObject, [
                    '_url',
                    'name'
                ], fromName);
                return toObject;
            }
            function listDocumentsConfigToMldev(fromObject, parentObject) {
                const toObject = {};
                const fromPageSize = getValueByPath(fromObject, [
                    'pageSize'
                ]);
                if (parentObject !== undefined && fromPageSize != null) setValueByPath(parentObject, [
                    '_query',
                    'pageSize'
                ], fromPageSize);
                const fromPageToken = getValueByPath(fromObject, [
                    'pageToken'
                ]);
                if (parentObject !== undefined && fromPageToken != null) setValueByPath(parentObject, [
                    '_query',
                    'pageToken'
                ], fromPageToken);
                return toObject;
            }
            function listDocumentsParametersToMldev(fromObject) {
                const toObject = {};
                const fromParent = getValueByPath(fromObject, [
                    'parent'
                ]);
                if (fromParent != null) setValueByPath(toObject, [
                    '_url',
                    'parent'
                ], fromParent);
                const fromConfig = getValueByPath(fromObject, [
                    'config'
                ]);
                if (fromConfig != null) listDocumentsConfigToMldev(fromConfig, toObject);
                return toObject;
            }
            function listDocumentsResponseFromMldev(fromObject) {
                const toObject = {};
                const fromSdkHttpResponse = getValueByPath(fromObject, [
                    'sdkHttpResponse'
                ]);
                if (fromSdkHttpResponse != null) setValueByPath(toObject, [
                    'sdkHttpResponse'
                ], fromSdkHttpResponse);
                const fromNextPageToken = getValueByPath(fromObject, [
                    'nextPageToken'
                ]);
                if (fromNextPageToken != null) setValueByPath(toObject, [
                    'nextPageToken'
                ], fromNextPageToken);
                const fromDocuments = getValueByPath(fromObject, [
                    'documents'
                ]);
                if (fromDocuments != null) {
                    let transformedList = fromDocuments;
                    if (Array.isArray(transformedList)) transformedList = transformedList.map((item)=>{
                        return item;
                    });
                    setValueByPath(toObject, [
                        'documents'
                    ], transformedList);
                }
                return toObject;
            }
            class Documents extends BaseModule {
                constructor(apiClient){
                    super();
                    this.apiClient = apiClient;
                    this.list = async (params)=>{
                        return new Pager(PagedItem.PAGED_ITEM_DOCUMENTS, (x)=>this.listInternal({
                                parent: params.parent,
                                config: x.config
                            }), await this.listInternal(params), params);
                    };
                }
                async get(params) {
                    var _a, _b;
                    let response;
                    let path = '';
                    let queryParams = {};
                    if (this.apiClient.isVertexAI()) throw new Error('This method is only supported by the Gemini Developer API.');
                    else {
                        const body = getDocumentParametersToMldev(params);
                        path = formatMap('{name}', body['_url']);
                        queryParams = body['_query'];
                        delete body['_url'];
                        delete body['_query'];
                        response = this.apiClient.request({
                            path: path,
                            queryParams: queryParams,
                            body: JSON.stringify(body),
                            httpMethod: 'GET',
                            httpOptions: (_a = params.config) === null || _a === void 0 ? void 0 : _a.httpOptions,
                            abortSignal: (_b = params.config) === null || _b === void 0 ? void 0 : _b.abortSignal
                        }).then((httpResponse)=>{
                            return httpResponse.json();
                        });
                        return response.then((resp)=>{
                            return resp;
                        });
                    }
                }
                async delete(params) {
                    var _a, _b;
                    let path = '';
                    let queryParams = {};
                    if (this.apiClient.isVertexAI()) throw new Error('This method is only supported by the Gemini Developer API.');
                    else {
                        const body = deleteDocumentParametersToMldev(params);
                        path = formatMap('{name}', body['_url']);
                        queryParams = body['_query'];
                        delete body['_url'];
                        delete body['_query'];
                        await this.apiClient.request({
                            path: path,
                            queryParams: queryParams,
                            body: JSON.stringify(body),
                            httpMethod: 'DELETE',
                            httpOptions: (_a = params.config) === null || _a === void 0 ? void 0 : _a.httpOptions,
                            abortSignal: (_b = params.config) === null || _b === void 0 ? void 0 : _b.abortSignal
                        });
                    }
                }
                async listInternal(params) {
                    var _a, _b;
                    let response;
                    let path = '';
                    let queryParams = {};
                    if (this.apiClient.isVertexAI()) throw new Error('This method is only supported by the Gemini Developer API.');
                    else {
                        const body = listDocumentsParametersToMldev(params);
                        path = formatMap('{parent}/documents', body['_url']);
                        queryParams = body['_query'];
                        delete body['_url'];
                        delete body['_query'];
                        response = this.apiClient.request({
                            path: path,
                            queryParams: queryParams,
                            body: JSON.stringify(body),
                            httpMethod: 'GET',
                            httpOptions: (_a = params.config) === null || _a === void 0 ? void 0 : _a.httpOptions,
                            abortSignal: (_b = params.config) === null || _b === void 0 ? void 0 : _b.abortSignal
                        }).then((httpResponse)=>{
                            return httpResponse.json();
                        });
                        return response.then((apiResponse)=>{
                            const resp = listDocumentsResponseFromMldev(apiResponse);
                            const typedResp = new ListDocumentsResponse();
                            Object.assign(typedResp, resp);
                            return typedResp;
                        });
                    }
                }
            }
            class FileSearchStores extends BaseModule {
                constructor(apiClient, documents = new Documents(apiClient)){
                    super();
                    this.apiClient = apiClient;
                    this.documents = documents;
                    this.list = async (params = {})=>{
                        return new Pager(PagedItem.PAGED_ITEM_FILE_SEARCH_STORES, (x)=>this.listInternal(x), await this.listInternal(params), params);
                    };
                }
                async uploadToFileSearchStore(params) {
                    if (this.apiClient.isVertexAI()) throw new Error('Vertex AI does not support uploading files to a file search store.');
                    return this.apiClient.uploadFileToFileSearchStore(params.fileSearchStoreName, params.file, params.config);
                }
                async create(params) {
                    var _a, _b;
                    let response;
                    let path = '';
                    let queryParams = {};
                    if (this.apiClient.isVertexAI()) throw new Error('This method is only supported by the Gemini Developer API.');
                    else {
                        const body = createFileSearchStoreParametersToMldev(params);
                        path = formatMap('fileSearchStores', body['_url']);
                        queryParams = body['_query'];
                        delete body['_url'];
                        delete body['_query'];
                        response = this.apiClient.request({
                            path: path,
                            queryParams: queryParams,
                            body: JSON.stringify(body),
                            httpMethod: 'POST',
                            httpOptions: (_a = params.config) === null || _a === void 0 ? void 0 : _a.httpOptions,
                            abortSignal: (_b = params.config) === null || _b === void 0 ? void 0 : _b.abortSignal
                        }).then((httpResponse)=>{
                            return httpResponse.json();
                        });
                        return response.then((resp)=>{
                            return resp;
                        });
                    }
                }
                async get(params) {
                    var _a, _b;
                    let response;
                    let path = '';
                    let queryParams = {};
                    if (this.apiClient.isVertexAI()) throw new Error('This method is only supported by the Gemini Developer API.');
                    else {
                        const body = getFileSearchStoreParametersToMldev(params);
                        path = formatMap('{name}', body['_url']);
                        queryParams = body['_query'];
                        delete body['_url'];
                        delete body['_query'];
                        response = this.apiClient.request({
                            path: path,
                            queryParams: queryParams,
                            body: JSON.stringify(body),
                            httpMethod: 'GET',
                            httpOptions: (_a = params.config) === null || _a === void 0 ? void 0 : _a.httpOptions,
                            abortSignal: (_b = params.config) === null || _b === void 0 ? void 0 : _b.abortSignal
                        }).then((httpResponse)=>{
                            return httpResponse.json();
                        });
                        return response.then((resp)=>{
                            return resp;
                        });
                    }
                }
                async delete(params) {
                    var _a, _b;
                    let path = '';
                    let queryParams = {};
                    if (this.apiClient.isVertexAI()) throw new Error('This method is only supported by the Gemini Developer API.');
                    else {
                        const body = deleteFileSearchStoreParametersToMldev(params);
                        path = formatMap('{name}', body['_url']);
                        queryParams = body['_query'];
                        delete body['_url'];
                        delete body['_query'];
                        await this.apiClient.request({
                            path: path,
                            queryParams: queryParams,
                            body: JSON.stringify(body),
                            httpMethod: 'DELETE',
                            httpOptions: (_a = params.config) === null || _a === void 0 ? void 0 : _a.httpOptions,
                            abortSignal: (_b = params.config) === null || _b === void 0 ? void 0 : _b.abortSignal
                        });
                    }
                }
                async listInternal(params) {
                    var _a, _b;
                    let response;
                    let path = '';
                    let queryParams = {};
                    if (this.apiClient.isVertexAI()) throw new Error('This method is only supported by the Gemini Developer API.');
                    else {
                        const body = listFileSearchStoresParametersToMldev(params);
                        path = formatMap('fileSearchStores', body['_url']);
                        queryParams = body['_query'];
                        delete body['_url'];
                        delete body['_query'];
                        response = this.apiClient.request({
                            path: path,
                            queryParams: queryParams,
                            body: JSON.stringify(body),
                            httpMethod: 'GET',
                            httpOptions: (_a = params.config) === null || _a === void 0 ? void 0 : _a.httpOptions,
                            abortSignal: (_b = params.config) === null || _b === void 0 ? void 0 : _b.abortSignal
                        }).then((httpResponse)=>{
                            return httpResponse.json();
                        });
                        return response.then((apiResponse)=>{
                            const resp = listFileSearchStoresResponseFromMldev(apiResponse);
                            const typedResp = new ListFileSearchStoresResponse();
                            Object.assign(typedResp, resp);
                            return typedResp;
                        });
                    }
                }
                async uploadToFileSearchStoreInternal(params) {
                    var _a, _b;
                    let response;
                    let path = '';
                    let queryParams = {};
                    if (this.apiClient.isVertexAI()) throw new Error('This method is only supported by the Gemini Developer API.');
                    else {
                        const body = uploadToFileSearchStoreParametersToMldev(params);
                        path = formatMap('upload/v1beta/{file_search_store_name}:uploadToFileSearchStore', body['_url']);
                        queryParams = body['_query'];
                        delete body['_url'];
                        delete body['_query'];
                        response = this.apiClient.request({
                            path: path,
                            queryParams: queryParams,
                            body: JSON.stringify(body),
                            httpMethod: 'POST',
                            httpOptions: (_a = params.config) === null || _a === void 0 ? void 0 : _a.httpOptions,
                            abortSignal: (_b = params.config) === null || _b === void 0 ? void 0 : _b.abortSignal
                        }).then((httpResponse)=>{
                            return httpResponse.json();
                        });
                        return response.then((apiResponse)=>{
                            const resp = uploadToFileSearchStoreResumableResponseFromMldev(apiResponse);
                            const typedResp = new UploadToFileSearchStoreResumableResponse();
                            Object.assign(typedResp, resp);
                            return typedResp;
                        });
                    }
                }
                async importFile(params) {
                    var _a, _b;
                    let response;
                    let path = '';
                    let queryParams = {};
                    if (this.apiClient.isVertexAI()) throw new Error('This method is only supported by the Gemini Developer API.');
                    else {
                        const body = importFileParametersToMldev(params);
                        path = formatMap('{file_search_store_name}:importFile', body['_url']);
                        queryParams = body['_query'];
                        delete body['_url'];
                        delete body['_query'];
                        response = this.apiClient.request({
                            path: path,
                            queryParams: queryParams,
                            body: JSON.stringify(body),
                            httpMethod: 'POST',
                            httpOptions: (_a = params.config) === null || _a === void 0 ? void 0 : _a.httpOptions,
                            abortSignal: (_b = params.config) === null || _b === void 0 ? void 0 : _b.abortSignal
                        }).then((httpResponse)=>{
                            return httpResponse.json();
                        });
                        return response.then((apiResponse)=>{
                            const resp = importFileOperationFromMldev(apiResponse);
                            const typedResp = new ImportFileOperation();
                            Object.assign(typedResp, resp);
                            return typedResp;
                        });
                    }
                }
            }
            let uuid4Internal = function() {
                const { crypto } = globalThis;
                if (crypto === null || crypto === void 0 ? void 0 : crypto.randomUUID) {
                    uuid4Internal = crypto.randomUUID.bind(crypto);
                    return crypto.randomUUID();
                }
                const u8 = new Uint8Array(1);
                const randomByte = crypto ? ()=>crypto.getRandomValues(u8)[0] : ()=>Math.random() * 0xff & 0xff;
                return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, (c)=>(+c ^ randomByte() & 15 >> +c / 4).toString(16));
            };
            const uuid4 = ()=>uuid4Internal();
            function isAbortError(err) {
                return typeof err === 'object' && err !== null && ('name' in err && err.name === 'AbortError' || 'message' in err && String(err.message).includes('FetchRequestCanceledException'));
            }
            const castToError = (err)=>{
                if (err instanceof Error) return err;
                if (typeof err === 'object' && err !== null) {
                    try {
                        if (Object.prototype.toString.call(err) === '[object Error]') {
                            const error = new Error(err.message, err.cause ? {
                                cause: err.cause
                            } : {});
                            if (err.stack) error.stack = err.stack;
                            if (err.cause && !error.cause) error.cause = err.cause;
                            if (err.name) error.name = err.name;
                            return error;
                        }
                    } catch (_a) {}
                    try {
                        return new Error(JSON.stringify(err));
                    } catch (_b) {}
                }
                return new Error(err);
            };
            class GeminiNextGenAPIClientError extends Error {
            }
            class APIError extends GeminiNextGenAPIClientError {
                constructor(status, error, message, headers){
                    super(`${APIError.makeMessage(status, error, message)}`);
                    this.status = status;
                    this.headers = headers;
                    this.error = error;
                }
                static makeMessage(status, error, message) {
                    const msg = (error === null || error === void 0 ? void 0 : error.message) ? typeof error.message === 'string' ? error.message : JSON.stringify(error.message) : error ? JSON.stringify(error) : message;
                    if (status && msg) return `${status} ${msg}`;
                    if (status) return `${status} status code (no body)`;
                    if (msg) return msg;
                    return '(no status code or body)';
                }
                static generate(status, errorResponse, message, headers) {
                    if (!status || !headers) return new APIConnectionError({
                        message,
                        cause: castToError(errorResponse)
                    });
                    const error = errorResponse;
                    if (status === 400) return new BadRequestError(status, error, message, headers);
                    if (status === 401) return new AuthenticationError(status, error, message, headers);
                    if (status === 403) return new PermissionDeniedError(status, error, message, headers);
                    if (status === 404) return new NotFoundError(status, error, message, headers);
                    if (status === 409) return new ConflictError(status, error, message, headers);
                    if (status === 422) return new UnprocessableEntityError(status, error, message, headers);
                    if (status === 429) return new RateLimitError(status, error, message, headers);
                    if (status >= 500) return new InternalServerError(status, error, message, headers);
                    return new APIError(status, error, message, headers);
                }
            }
            class APIUserAbortError extends APIError {
                constructor({ message } = {}){
                    super(undefined, undefined, message || 'Request was aborted.', undefined);
                }
            }
            class APIConnectionError extends APIError {
                constructor({ message, cause }){
                    super(undefined, undefined, message || 'Connection error.', undefined);
                    if (cause) this.cause = cause;
                }
            }
            class APIConnectionTimeoutError extends APIConnectionError {
                constructor({ message } = {}){
                    super({
                        message: message !== null && message !== void 0 ? message : 'Request timed out.'
                    });
                }
            }
            class BadRequestError extends APIError {
            }
            class AuthenticationError extends APIError {
            }
            class PermissionDeniedError extends APIError {
            }
            class NotFoundError extends APIError {
            }
            class ConflictError extends APIError {
            }
            class UnprocessableEntityError extends APIError {
            }
            class RateLimitError extends APIError {
            }
            class InternalServerError extends APIError {
            }
            const startsWithSchemeRegexp = /^[a-z][a-z0-9+.-]*:/i;
            const isAbsoluteURL = (url)=>{
                return startsWithSchemeRegexp.test(url);
            };
            let isArrayInternal = (val)=>(isArrayInternal = Array.isArray, isArrayInternal(val));
            const isArray = isArrayInternal;
            let isReadonlyArrayInternal = isArray;
            const isReadonlyArray = isReadonlyArrayInternal;
            function isEmptyObj(obj) {
                if (!obj) return true;
                for(const _k in obj)return false;
                return true;
            }
            function hasOwn(obj, key) {
                return Object.prototype.hasOwnProperty.call(obj, key);
            }
            const validatePositiveInteger = (name, n)=>{
                if (typeof n !== 'number' || !Number.isInteger(n)) throw new GeminiNextGenAPIClientError(`${name} must be an integer`);
                if (n < 0) throw new GeminiNextGenAPIClientError(`${name} must be a positive integer`);
                return n;
            };
            const safeJSON = (text)=>{
                try {
                    return JSON.parse(text);
                } catch (err) {
                    return undefined;
                }
            };
            const sleep$1 = (ms)=>new Promise((resolve)=>setTimeout(resolve, ms));
            const VERSION = '0.0.1';
            function getDetectedPlatform() {
                if (typeof Deno !== 'undefined' && Deno.build != null) return 'deno';
                if (typeof EdgeRuntime !== 'undefined') return 'edge';
                if (Object.prototype.toString.call(typeof globalThis.process !== 'undefined' ? globalThis.process : 0) === '[object process]') return 'node';
                return 'unknown';
            }
            const getPlatformProperties = ()=>{
                var _a, _b, _c, _d, _e;
                const detectedPlatform = getDetectedPlatform();
                if (detectedPlatform === 'deno') return {
                    'X-Stainless-Lang': 'js',
                    'X-Stainless-Package-Version': VERSION,
                    'X-Stainless-OS': normalizePlatform(Deno.build.os),
                    'X-Stainless-Arch': normalizeArch(Deno.build.arch),
                    'X-Stainless-Runtime': 'deno',
                    'X-Stainless-Runtime-Version': typeof Deno.version === 'string' ? Deno.version : (_b = (_a = Deno.version) === null || _a === void 0 ? void 0 : _a.deno) !== null && _b !== void 0 ? _b : 'unknown'
                };
                if (typeof EdgeRuntime !== 'undefined') return {
                    'X-Stainless-Lang': 'js',
                    'X-Stainless-Package-Version': VERSION,
                    'X-Stainless-OS': 'Unknown',
                    'X-Stainless-Arch': `other:${EdgeRuntime}`,
                    'X-Stainless-Runtime': 'edge',
                    'X-Stainless-Runtime-Version': globalThis.process.version
                };
                if (detectedPlatform === 'node') return {
                    'X-Stainless-Lang': 'js',
                    'X-Stainless-Package-Version': VERSION,
                    'X-Stainless-OS': normalizePlatform((_c = globalThis.process.platform) !== null && _c !== void 0 ? _c : 'unknown'),
                    'X-Stainless-Arch': normalizeArch((_d = globalThis.process.arch) !== null && _d !== void 0 ? _d : 'unknown'),
                    'X-Stainless-Runtime': 'node',
                    'X-Stainless-Runtime-Version': (_e = globalThis.process.version) !== null && _e !== void 0 ? _e : 'unknown'
                };
                const browserInfo = getBrowserInfo();
                if (browserInfo) return {
                    'X-Stainless-Lang': 'js',
                    'X-Stainless-Package-Version': VERSION,
                    'X-Stainless-OS': 'Unknown',
                    'X-Stainless-Arch': 'unknown',
                    'X-Stainless-Runtime': `browser:${browserInfo.browser}`,
                    'X-Stainless-Runtime-Version': browserInfo.version
                };
                return {
                    'X-Stainless-Lang': 'js',
                    'X-Stainless-Package-Version': VERSION,
                    'X-Stainless-OS': 'Unknown',
                    'X-Stainless-Arch': 'unknown',
                    'X-Stainless-Runtime': 'unknown',
                    'X-Stainless-Runtime-Version': 'unknown'
                };
            };
            function getBrowserInfo() {
                if (typeof navigator === 'undefined' || !navigator) return null;
                const browserPatterns = [
                    {
                        key: 'edge',
                        pattern: /Edge(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/
                    },
                    {
                        key: 'ie',
                        pattern: /MSIE(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/
                    },
                    {
                        key: 'ie',
                        pattern: /Trident(?:.*rv\:(\d+)\.(\d+)(?:\.(\d+))?)?/
                    },
                    {
                        key: 'chrome',
                        pattern: /Chrome(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/
                    },
                    {
                        key: 'firefox',
                        pattern: /Firefox(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/
                    },
                    {
                        key: 'safari',
                        pattern: /(?:Version\W+(\d+)\.(\d+)(?:\.(\d+))?)?(?:\W+Mobile\S*)?\W+Safari/
                    }
                ];
                for (const { key, pattern } of browserPatterns){
                    const match = pattern.exec(navigator.userAgent);
                    if (match) {
                        const major = match[1] || 0;
                        const minor = match[2] || 0;
                        const patch = match[3] || 0;
                        return {
                            browser: key,
                            version: `${major}.${minor}.${patch}`
                        };
                    }
                }
                return null;
            }
            const normalizeArch = (arch)=>{
                if (arch === 'x32') return 'x32';
                if (arch === 'x86_64' || arch === 'x64') return 'x64';
                if (arch === 'arm') return 'arm';
                if (arch === 'aarch64' || arch === 'arm64') return 'arm64';
                if (arch) return `other:${arch}`;
                return 'unknown';
            };
            const normalizePlatform = (platform)=>{
                platform = platform.toLowerCase();
                if (platform.includes('ios')) return 'iOS';
                if (platform === 'android') return 'Android';
                if (platform === 'darwin') return 'MacOS';
                if (platform === 'win32') return 'Windows';
                if (platform === 'freebsd') return 'FreeBSD';
                if (platform === 'openbsd') return 'OpenBSD';
                if (platform === 'linux') return 'Linux';
                if (platform) return `Other:${platform}`;
                return 'Unknown';
            };
            let _platformHeaders;
            const getPlatformHeaders = ()=>{
                return _platformHeaders !== null && _platformHeaders !== void 0 ? _platformHeaders : _platformHeaders = getPlatformProperties();
            };
            function getDefaultFetch() {
                if (typeof fetch !== 'undefined') return fetch;
                throw new Error('`fetch` is not defined as a global; Either pass `fetch` to the client, `new GeminiNextGenAPIClient({ fetch })` or polyfill the global, `globalThis.fetch = fetch`');
            }
            function makeReadableStream(...args) {
                const ReadableStream = globalThis.ReadableStream;
                if (typeof ReadableStream === 'undefined') throw new Error('`ReadableStream` is not defined as a global; You will need to polyfill it, `globalThis.ReadableStream = ReadableStream`');
                return new ReadableStream(...args);
            }
            function ReadableStreamFrom(iterable) {
                let iter = Symbol.asyncIterator in iterable ? iterable[Symbol.asyncIterator]() : iterable[Symbol.iterator]();
                return makeReadableStream({
                    start () {},
                    async pull (controller) {
                        const { done, value } = await iter.next();
                        if (done) controller.close();
                        else controller.enqueue(value);
                    },
                    async cancel () {
                        var _a;
                        await ((_a = iter.return) === null || _a === void 0 ? void 0 : _a.call(iter));
                    }
                });
            }
            function ReadableStreamToAsyncIterable(stream) {
                if (stream[Symbol.asyncIterator]) return stream;
                const reader = stream.getReader();
                return {
                    async next () {
                        try {
                            const result = await reader.read();
                            if (result === null || result === void 0 ? void 0 : result.done) reader.releaseLock();
                            return result;
                        } catch (e) {
                            reader.releaseLock();
                            throw e;
                        }
                    },
                    async return () {
                        const cancelPromise = reader.cancel();
                        reader.releaseLock();
                        await cancelPromise;
                        return {
                            done: true,
                            value: undefined
                        };
                    },
                    [Symbol.asyncIterator] () {
                        return this;
                    }
                };
            }
            async function CancelReadableStream(stream) {
                var _a, _b;
                if (stream === null || typeof stream !== 'object') return;
                if (stream[Symbol.asyncIterator]) {
                    await ((_b = (_a = stream[Symbol.asyncIterator]()).return) === null || _b === void 0 ? void 0 : _b.call(_a));
                    return;
                }
                const reader = stream.getReader();
                const cancelPromise = reader.cancel();
                reader.releaseLock();
                await cancelPromise;
            }
            const FallbackEncoder = ({ headers, body })=>{
                return {
                    bodyHeaders: {
                        'content-type': 'application/json'
                    },
                    body: JSON.stringify(body)
                };
            };
            const checkFileSupport = ()=>{
                var _a;
                if (typeof File === 'undefined') {
                    const { process } = globalThis;
                    const isOldNode = typeof ((_a = process === null || process === void 0 ? void 0 : process.versions) === null || _a === void 0 ? void 0 : _a.node) === 'string' && parseInt(process.versions.node.split('.')) < 20;
                    throw new Error('`File` is not defined as a global, which is required for file uploads.' + (isOldNode ? " Update to Node 20 LTS or newer, or set `globalThis.File` to `import('node:buffer').File`." : ''));
                }
            };
            function makeFile(fileBits, fileName, options) {
                checkFileSupport();
                return new File(fileBits, fileName !== null && fileName !== void 0 ? fileName : 'unknown_file', options);
            }
            function getName(value) {
                return (typeof value === 'object' && value !== null && ('name' in value && value.name && String(value.name) || 'url' in value && value.url && String(value.url) || 'filename' in value && value.filename && String(value.filename) || 'path' in value && value.path && String(value.path)) || '').split(/[\\/]/).pop() || undefined;
            }
            const isAsyncIterable = (value)=>value != null && typeof value === 'object' && typeof value[Symbol.asyncIterator] === 'function';
            const isBlobLike = (value)=>value != null && typeof value === 'object' && typeof value.size === 'number' && typeof value.type === 'string' && typeof value.text === 'function' && typeof value.slice === 'function' && typeof value.arrayBuffer === 'function';
            const isFileLike = (value)=>value != null && typeof value === 'object' && typeof value.name === 'string' && typeof value.lastModified === 'number' && isBlobLike(value);
            const isResponseLike = (value)=>value != null && typeof value === 'object' && typeof value.url === 'string' && typeof value.blob === 'function';
            async function toFile(value, name, options) {
                checkFileSupport();
                value = await value;
                if (isFileLike(value)) {
                    if (value instanceof File) return value;
                    return makeFile([
                        await value.arrayBuffer()
                    ], value.name);
                }
                if (isResponseLike(value)) {
                    const blob = await value.blob();
                    name || (name = new URL(value.url).pathname.split(/[\\/]/).pop());
                    return makeFile(await getBytes(blob), name, options);
                }
                const parts = await getBytes(value);
                name || (name = getName(value));
                if (!(options === null || options === void 0 ? void 0 : options.type)) {
                    const type = parts.find((part)=>typeof part === 'object' && 'type' in part && part.type);
                    if (typeof type === 'string') options = Object.assign(Object.assign({}, options), {
                        type
                    });
                }
                return makeFile(parts, name, options);
            }
            async function getBytes(value) {
                var _a, e_1, _b, _c;
                var _d;
                let parts = [];
                if (typeof value === 'string' || ArrayBuffer.isView(value) || value instanceof ArrayBuffer) parts.push(value);
                else if (isBlobLike(value)) parts.push(value instanceof Blob ? value : await value.arrayBuffer());
                else if (isAsyncIterable(value)) try {
                    for(var _e = true, value_1 = __asyncValues(value), value_1_1; value_1_1 = await value_1.next(), _a = value_1_1.done, !_a; _e = true){
                        _c = value_1_1.value;
                        _e = false;
                        const chunk = _c;
                        parts.push(...await getBytes(chunk));
                    }
                } catch (e_1_1) {
                    e_1 = {
                        error: e_1_1
                    };
                } finally{
                    try {
                        if (!_e && !_a && (_b = value_1.return)) await _b.call(value_1);
                    } finally{
                        if (e_1) throw e_1.error;
                    }
                }
                else {
                    const constructor = (_d = value === null || value === void 0 ? void 0 : value.constructor) === null || _d === void 0 ? void 0 : _d.name;
                    throw new Error(`Unexpected data type: ${typeof value}${constructor ? `; constructor: ${constructor}` : ''}${propsForError(value)}`);
                }
                return parts;
            }
            function propsForError(value) {
                if (typeof value !== 'object' || value === null) return '';
                const props = Object.getOwnPropertyNames(value);
                return `; props: [${props.map((p)=>`"${p}"`).join(', ')}]`;
            }
            class APIResource {
                constructor(client){
                    this._client = client;
                }
            }
            APIResource._key = [];
            function encodeURIPath(str) {
                return str.replace(/[^A-Za-z0-9\-._~!$&'()*+,;=:@]+/g, encodeURIComponent);
            }
            const EMPTY = Object.freeze(Object.create(null));
            const createPathTagFunction = (pathEncoder = encodeURIPath)=>function path(statics, ...params) {
                    if (statics.length === 1) return statics[0];
                    let postPath = false;
                    const invalidSegments = [];
                    const path1 = statics.reduce((previousValue, currentValue, index)=>{
                        var _a, _b, _c;
                        if (/[?#]/.test(currentValue)) postPath = true;
                        const value = params[index];
                        let encoded = (postPath ? encodeURIComponent : pathEncoder)('' + value);
                        if (index !== params.length && (value == null || typeof value === 'object' && value.toString === ((_c = Object.getPrototypeOf((_b = Object.getPrototypeOf((_a = value.hasOwnProperty) !== null && _a !== void 0 ? _a : EMPTY)) !== null && _b !== void 0 ? _b : EMPTY)) === null || _c === void 0 ? void 0 : _c.toString))) {
                            encoded = value + '';
                            invalidSegments.push({
                                start: previousValue.length + currentValue.length,
                                length: encoded.length,
                                error: `Value of type ${Object.prototype.toString.call(value).slice(8, -1)} is not a valid path parameter`
                            });
                        }
                        return previousValue + currentValue + (index === params.length ? '' : encoded);
                    }, '');
                    const pathOnly = path1.split(/[?#]/, 1)[0];
                    const invalidSegmentPattern = /(?<=^|\/)(?:\.|%2e){1,2}(?=\/|$)/gi;
                    let match;
                    while((match = invalidSegmentPattern.exec(pathOnly)) !== null)invalidSegments.push({
                        start: match.index,
                        length: match[0].length,
                        error: `Value "${match[0]}" can\'t be safely passed as a path parameter`
                    });
                    invalidSegments.sort((a, b)=>a.start - b.start);
                    if (invalidSegments.length > 0) {
                        let lastEnd = 0;
                        const underline = invalidSegments.reduce((acc, segment)=>{
                            const spaces = ' '.repeat(segment.start - lastEnd);
                            const arrows = '^'.repeat(segment.length);
                            lastEnd = segment.start + segment.length;
                            return acc + spaces + arrows;
                        }, '');
                        throw new GeminiNextGenAPIClientError(`Path parameters result in path with invalid segments:\n${invalidSegments.map((e)=>e.error).join('\n')}\n${path1}\n${underline}`);
                    }
                    return path1;
                };
            const path = createPathTagFunction(encodeURIPath);
            class BaseInteractions extends APIResource {
                create(params, options) {
                    var _a;
                    const { api_version = this._client.apiVersion } = params, body = __rest(params, [
                        "api_version"
                    ]);
                    if ('model' in body && 'agent_config' in body) throw new GeminiNextGenAPIClientError(`Invalid request: specified \`model\` and \`agent_config\`. If specifying \`model\`, use \`generation_config\`.`);
                    if ('agent' in body && 'generation_config' in body) throw new GeminiNextGenAPIClientError(`Invalid request: specified \`agent\` and \`generation_config\`. If specifying \`agent\`, use \`agent_config\`.`);
                    return this._client.post(path`/${api_version}/interactions`, Object.assign(Object.assign({
                        body
                    }, options), {
                        stream: (_a = params.stream) !== null && _a !== void 0 ? _a : false
                    }));
                }
                delete(id, params = {}, options) {
                    const { api_version = this._client.apiVersion } = params !== null && params !== void 0 ? params : {};
                    return this._client.delete(path`/${api_version}/interactions/${id}`, options);
                }
                cancel(id, params = {}, options) {
                    const { api_version = this._client.apiVersion } = params !== null && params !== void 0 ? params : {};
                    return this._client.post(path`/${api_version}/interactions/${id}/cancel`, options);
                }
                get(id, params = {}, options) {
                    var _a;
                    const _b = params !== null && params !== void 0 ? params : {}, { api_version = this._client.apiVersion } = _b, query = __rest(_b, [
                        "api_version"
                    ]);
                    return this._client.get(path`/${api_version}/interactions/${id}`, Object.assign(Object.assign({
                        query
                    }, options), {
                        stream: (_a = params === null || params === void 0 ? void 0 : params.stream) !== null && _a !== void 0 ? _a : false
                    }));
                }
            }
            BaseInteractions._key = Object.freeze([
                'interactions'
            ]);
            class Interactions extends BaseInteractions {
            }
            function concatBytes(buffers) {
                let length = 0;
                for (const buffer of buffers)length += buffer.length;
                const output = new Uint8Array(length);
                let index = 0;
                for (const buffer of buffers){
                    output.set(buffer, index);
                    index += buffer.length;
                }
                return output;
            }
            let encodeUTF8_;
            function encodeUTF8(str) {
                let encoder;
                return (encodeUTF8_ !== null && encodeUTF8_ !== void 0 ? encodeUTF8_ : (encoder = new globalThis.TextEncoder(), encodeUTF8_ = encoder.encode.bind(encoder)))(str);
            }
            let decodeUTF8_;
            function decodeUTF8(bytes) {
                let decoder;
                return (decodeUTF8_ !== null && decodeUTF8_ !== void 0 ? decodeUTF8_ : (decoder = new globalThis.TextDecoder(), decodeUTF8_ = decoder.decode.bind(decoder)))(bytes);
            }
            class LineDecoder {
                constructor(){
                    this.buffer = new Uint8Array();
                    this.carriageReturnIndex = null;
                }
                decode(chunk) {
                    if (chunk == null) return [];
                    const binaryChunk = chunk instanceof ArrayBuffer ? new Uint8Array(chunk) : typeof chunk === 'string' ? encodeUTF8(chunk) : chunk;
                    this.buffer = concatBytes([
                        this.buffer,
                        binaryChunk
                    ]);
                    const lines = [];
                    let patternIndex;
                    while((patternIndex = findNewlineIndex(this.buffer, this.carriageReturnIndex)) != null){
                        if (patternIndex.carriage && this.carriageReturnIndex == null) {
                            this.carriageReturnIndex = patternIndex.index;
                            continue;
                        }
                        if (this.carriageReturnIndex != null && (patternIndex.index !== this.carriageReturnIndex + 1 || patternIndex.carriage)) {
                            lines.push(decodeUTF8(this.buffer.subarray(0, this.carriageReturnIndex - 1)));
                            this.buffer = this.buffer.subarray(this.carriageReturnIndex);
                            this.carriageReturnIndex = null;
                            continue;
                        }
                        const endIndex = this.carriageReturnIndex !== null ? patternIndex.preceding - 1 : patternIndex.preceding;
                        const line = decodeUTF8(this.buffer.subarray(0, endIndex));
                        lines.push(line);
                        this.buffer = this.buffer.subarray(patternIndex.index);
                        this.carriageReturnIndex = null;
                    }
                    return lines;
                }
                flush() {
                    if (!this.buffer.length) return [];
                    return this.decode('\n');
                }
            }
            LineDecoder.NEWLINE_CHARS = new Set([
                '\n',
                '\r'
            ]);
            LineDecoder.NEWLINE_REGEXP = /\r\n|[\n\r]/g;
            function findNewlineIndex(buffer, startIndex) {
                const newline = 0x0a;
                const carriage = 0x0d;
                for(let i = startIndex !== null && startIndex !== void 0 ? startIndex : 0; i < buffer.length; i++){
                    if (buffer[i] === newline) return {
                        preceding: i,
                        index: i + 1,
                        carriage: false
                    };
                    if (buffer[i] === carriage) return {
                        preceding: i,
                        index: i + 1,
                        carriage: true
                    };
                }
                return null;
            }
            function findDoubleNewlineIndex(buffer) {
                const newline = 0x0a;
                const carriage = 0x0d;
                for(let i = 0; i < buffer.length - 1; i++){
                    if (buffer[i] === newline && buffer[i + 1] === newline) return i + 2;
                    if (buffer[i] === carriage && buffer[i + 1] === carriage) return i + 2;
                    if (buffer[i] === carriage && buffer[i + 1] === newline && i + 3 < buffer.length && buffer[i + 2] === carriage && buffer[i + 3] === newline) return i + 4;
                }
                return -1;
            }
            const levelNumbers = {
                off: 0,
                error: 200,
                warn: 300,
                info: 400,
                debug: 500
            };
            const parseLogLevel = (maybeLevel, sourceName, client)=>{
                if (!maybeLevel) return undefined;
                if (hasOwn(levelNumbers, maybeLevel)) return maybeLevel;
                loggerFor(client).warn(`${sourceName} was set to ${JSON.stringify(maybeLevel)}, expected one of ${JSON.stringify(Object.keys(levelNumbers))}`);
                return undefined;
            };
            function noop() {}
            function makeLogFn(fnLevel, logger, logLevel) {
                if (!logger || levelNumbers[fnLevel] > levelNumbers[logLevel]) return noop;
                else return logger[fnLevel].bind(logger);
            }
            const noopLogger = {
                error: noop,
                warn: noop,
                info: noop,
                debug: noop
            };
            let cachedLoggers = new WeakMap();
            function loggerFor(client) {
                var _a;
                const logger = client.logger;
                const logLevel = (_a = client.logLevel) !== null && _a !== void 0 ? _a : 'off';
                if (!logger) return noopLogger;
                const cachedLogger = cachedLoggers.get(logger);
                if (cachedLogger && cachedLogger[0] === logLevel) return cachedLogger[1];
                const levelLogger = {
                    error: makeLogFn('error', logger, logLevel),
                    warn: makeLogFn('warn', logger, logLevel),
                    info: makeLogFn('info', logger, logLevel),
                    debug: makeLogFn('debug', logger, logLevel)
                };
                cachedLoggers.set(logger, [
                    logLevel,
                    levelLogger
                ]);
                return levelLogger;
            }
            const formatRequestDetails = (details)=>{
                if (details.options) {
                    details.options = Object.assign({}, details.options);
                    delete details.options['headers'];
                }
                if (details.headers) details.headers = Object.fromEntries((details.headers instanceof Headers ? [
                    ...details.headers
                ] : Object.entries(details.headers)).map(([name, value])=>[
                        name,
                        name.toLowerCase() === 'x-goog-api-key' || name.toLowerCase() === 'authorization' || name.toLowerCase() === 'cookie' || name.toLowerCase() === 'set-cookie' ? '***' : value
                    ]));
                if ('retryOfRequestLogID' in details) {
                    if (details.retryOfRequestLogID) details.retryOf = details.retryOfRequestLogID;
                    delete details.retryOfRequestLogID;
                }
                return details;
            };
            class Stream {
                constructor(iterator, controller, client){
                    this.iterator = iterator;
                    this.controller = controller;
                    this.client = client;
                }
                static fromSSEResponse(response, controller, client) {
                    let consumed = false;
                    const logger = client ? loggerFor(client) : console;
                    function iterator() {
                        return __asyncGenerator(this, arguments, function* iterator_1() {
                            var _a, e_1, _b, _c;
                            if (consumed) throw new GeminiNextGenAPIClientError('Cannot iterate over a consumed stream, use `.tee()` to split the stream.');
                            consumed = true;
                            let done = false;
                            try {
                                try {
                                    for(var _d = true, _e = __asyncValues(_iterSSEMessages(response, controller)), _f; _f = yield __await(_e.next()), _a = _f.done, !_a; _d = true){
                                        _c = _f.value;
                                        _d = false;
                                        const sse = _c;
                                        if (done) continue;
                                        if (sse.data.startsWith('[DONE]')) {
                                            done = true;
                                            continue;
                                        } else try {
                                            yield yield __await(JSON.parse(sse.data));
                                        } catch (e) {
                                            logger.error(`Could not parse message into JSON:`, sse.data);
                                            logger.error(`From chunk:`, sse.raw);
                                            throw e;
                                        }
                                    }
                                } catch (e_1_1) {
                                    e_1 = {
                                        error: e_1_1
                                    };
                                } finally{
                                    try {
                                        if (!_d && !_a && (_b = _e.return)) yield __await(_b.call(_e));
                                    } finally{
                                        if (e_1) throw e_1.error;
                                    }
                                }
                                done = true;
                            } catch (e) {
                                if (isAbortError(e)) return yield __await(void 0);
                                throw e;
                            } finally{
                                if (!done) controller.abort();
                            }
                        });
                    }
                    return new Stream(iterator, controller, client);
                }
                static fromReadableStream(readableStream, controller, client) {
                    let consumed = false;
                    function iterLines() {
                        return __asyncGenerator(this, arguments, function* iterLines_1() {
                            var _a, e_2, _b, _c;
                            const lineDecoder = new LineDecoder();
                            const iter = ReadableStreamToAsyncIterable(readableStream);
                            try {
                                for(var _d = true, iter_1 = __asyncValues(iter), iter_1_1; iter_1_1 = yield __await(iter_1.next()), _a = iter_1_1.done, !_a; _d = true){
                                    _c = iter_1_1.value;
                                    _d = false;
                                    const chunk = _c;
                                    for (const line of lineDecoder.decode(chunk))yield yield __await(line);
                                }
                            } catch (e_2_1) {
                                e_2 = {
                                    error: e_2_1
                                };
                            } finally{
                                try {
                                    if (!_d && !_a && (_b = iter_1.return)) yield __await(_b.call(iter_1));
                                } finally{
                                    if (e_2) throw e_2.error;
                                }
                            }
                            for (const line of lineDecoder.flush())yield yield __await(line);
                        });
                    }
                    function iterator() {
                        return __asyncGenerator(this, arguments, function* iterator_2() {
                            var _a, e_3, _b, _c;
                            if (consumed) throw new GeminiNextGenAPIClientError('Cannot iterate over a consumed stream, use `.tee()` to split the stream.');
                            consumed = true;
                            let done = false;
                            try {
                                try {
                                    for(var _d = true, _e = __asyncValues(iterLines()), _f; _f = yield __await(_e.next()), _a = _f.done, !_a; _d = true){
                                        _c = _f.value;
                                        _d = false;
                                        const line = _c;
                                        if (done) continue;
                                        if (line) yield yield __await(JSON.parse(line));
                                    }
                                } catch (e_3_1) {
                                    e_3 = {
                                        error: e_3_1
                                    };
                                } finally{
                                    try {
                                        if (!_d && !_a && (_b = _e.return)) yield __await(_b.call(_e));
                                    } finally{
                                        if (e_3) throw e_3.error;
                                    }
                                }
                                done = true;
                            } catch (e) {
                                if (isAbortError(e)) return yield __await(void 0);
                                throw e;
                            } finally{
                                if (!done) controller.abort();
                            }
                        });
                    }
                    return new Stream(iterator, controller, client);
                }
                [Symbol.asyncIterator]() {
                    return this.iterator();
                }
                tee() {
                    const left = [];
                    const right = [];
                    const iterator = this.iterator();
                    const teeIterator = (queue)=>{
                        return {
                            next: ()=>{
                                if (queue.length === 0) {
                                    const result = iterator.next();
                                    left.push(result);
                                    right.push(result);
                                }
                                return queue.shift();
                            }
                        };
                    };
                    return [
                        new Stream(()=>teeIterator(left), this.controller, this.client),
                        new Stream(()=>teeIterator(right), this.controller, this.client)
                    ];
                }
                toReadableStream() {
                    const self = this;
                    let iter;
                    return makeReadableStream({
                        async start () {
                            iter = self[Symbol.asyncIterator]();
                        },
                        async pull (ctrl) {
                            try {
                                const { value, done } = await iter.next();
                                if (done) return ctrl.close();
                                const bytes = encodeUTF8(JSON.stringify(value) + '\n');
                                ctrl.enqueue(bytes);
                            } catch (err) {
                                ctrl.error(err);
                            }
                        },
                        async cancel () {
                            var _a;
                            await ((_a = iter.return) === null || _a === void 0 ? void 0 : _a.call(iter));
                        }
                    });
                }
            }
            function _iterSSEMessages(response, controller) {
                return __asyncGenerator(this, arguments, function* _iterSSEMessages_1() {
                    var _a, e_4, _b, _c;
                    if (!response.body) {
                        controller.abort();
                        if (typeof globalThis.navigator !== 'undefined' && globalThis.navigator.product === 'ReactNative') throw new GeminiNextGenAPIClientError(`The default react-native fetch implementation does not support streaming. Please use expo/fetch: https://docs.expo.dev/versions/latest/sdk/expo/#expofetch-api`);
                        throw new GeminiNextGenAPIClientError(`Attempted to iterate over a response with no body`);
                    }
                    const sseDecoder = new SSEDecoder();
                    const lineDecoder = new LineDecoder();
                    const iter = ReadableStreamToAsyncIterable(response.body);
                    try {
                        for(var _d = true, _e = __asyncValues(iterSSEChunks(iter)), _f; _f = yield __await(_e.next()), _a = _f.done, !_a; _d = true){
                            _c = _f.value;
                            _d = false;
                            const sseChunk = _c;
                            for (const line of lineDecoder.decode(sseChunk)){
                                const sse = sseDecoder.decode(line);
                                if (sse) yield yield __await(sse);
                            }
                        }
                    } catch (e_4_1) {
                        e_4 = {
                            error: e_4_1
                        };
                    } finally{
                        try {
                            if (!_d && !_a && (_b = _e.return)) yield __await(_b.call(_e));
                        } finally{
                            if (e_4) throw e_4.error;
                        }
                    }
                    for (const line of lineDecoder.flush()){
                        const sse = sseDecoder.decode(line);
                        if (sse) yield yield __await(sse);
                    }
                });
            }
            function iterSSEChunks(iterator) {
                return __asyncGenerator(this, arguments, function* iterSSEChunks_1() {
                    var _a, e_5, _b, _c;
                    let data = new Uint8Array();
                    try {
                        for(var _d = true, iterator_3 = __asyncValues(iterator), iterator_3_1; iterator_3_1 = yield __await(iterator_3.next()), _a = iterator_3_1.done, !_a; _d = true){
                            _c = iterator_3_1.value;
                            _d = false;
                            const chunk = _c;
                            if (chunk == null) continue;
                            const binaryChunk = chunk instanceof ArrayBuffer ? new Uint8Array(chunk) : typeof chunk === 'string' ? encodeUTF8(chunk) : chunk;
                            let newData = new Uint8Array(data.length + binaryChunk.length);
                            newData.set(data);
                            newData.set(binaryChunk, data.length);
                            data = newData;
                            let patternIndex;
                            while((patternIndex = findDoubleNewlineIndex(data)) !== -1){
                                yield yield __await(data.slice(0, patternIndex));
                                data = data.slice(patternIndex);
                            }
                        }
                    } catch (e_5_1) {
                        e_5 = {
                            error: e_5_1
                        };
                    } finally{
                        try {
                            if (!_d && !_a && (_b = iterator_3.return)) yield __await(_b.call(iterator_3));
                        } finally{
                            if (e_5) throw e_5.error;
                        }
                    }
                    if (data.length > 0) yield yield __await(data);
                });
            }
            class SSEDecoder {
                constructor(){
                    this.event = null;
                    this.data = [];
                    this.chunks = [];
                }
                decode(line) {
                    if (line.endsWith('\r')) line = line.substring(0, line.length - 1);
                    if (!line) {
                        if (!this.event && !this.data.length) return null;
                        const sse = {
                            event: this.event,
                            data: this.data.join('\n'),
                            raw: this.chunks
                        };
                        this.event = null;
                        this.data = [];
                        this.chunks = [];
                        return sse;
                    }
                    this.chunks.push(line);
                    if (line.startsWith(':')) return null;
                    let [fieldname, _, value] = partition(line, ':');
                    if (value.startsWith(' ')) value = value.substring(1);
                    if (fieldname === 'event') this.event = value;
                    else if (fieldname === 'data') this.data.push(value);
                    return null;
                }
            }
            function partition(str, delimiter) {
                const index = str.indexOf(delimiter);
                if (index !== -1) return [
                    str.substring(0, index),
                    delimiter,
                    str.substring(index + delimiter.length)
                ];
                return [
                    str,
                    '',
                    ''
                ];
            }
            async function defaultParseResponse(client, props) {
                const { response, requestLogID, retryOfRequestLogID, startTime } = props;
                const body = await (async ()=>{
                    var _a;
                    if (props.options.stream) {
                        loggerFor(client).debug('response', response.status, response.url, response.headers, response.body);
                        if (props.options.__streamClass) return props.options.__streamClass.fromSSEResponse(response, props.controller, client);
                        return Stream.fromSSEResponse(response, props.controller, client);
                    }
                    if (response.status === 204) return null;
                    if (props.options.__binaryResponse) return response;
                    const contentType = response.headers.get('content-type');
                    const mediaType = (_a = contentType === null || contentType === void 0 ? void 0 : contentType.split(';')[0]) === null || _a === void 0 ? void 0 : _a.trim();
                    const isJSON = (mediaType === null || mediaType === void 0 ? void 0 : mediaType.includes('application/json')) || (mediaType === null || mediaType === void 0 ? void 0 : mediaType.endsWith('+json'));
                    if (isJSON) {
                        const json = await response.json();
                        return json;
                    }
                    const text = await response.text();
                    return text;
                })();
                loggerFor(client).debug(`[${requestLogID}] response parsed`, formatRequestDetails({
                    retryOfRequestLogID,
                    url: response.url,
                    status: response.status,
                    body,
                    durationMs: Date.now() - startTime
                }));
                return body;
            }
            class APIPromise extends Promise {
                constructor(client, responsePromise, parseResponse = defaultParseResponse){
                    super((resolve)=>{
                        resolve(null);
                    });
                    this.responsePromise = responsePromise;
                    this.parseResponse = parseResponse;
                    this.client = client;
                }
                _thenUnwrap(transform) {
                    return new APIPromise(this.client, this.responsePromise, async (client, props)=>transform(await this.parseResponse(client, props), props));
                }
                asResponse() {
                    return this.responsePromise.then((p)=>p.response);
                }
                async withResponse() {
                    const [data, response] = await Promise.all([
                        this.parse(),
                        this.asResponse()
                    ]);
                    return {
                        data,
                        response
                    };
                }
                parse() {
                    if (!this.parsedPromise) this.parsedPromise = this.responsePromise.then((data)=>this.parseResponse(this.client, data));
                    return this.parsedPromise;
                }
                then(onfulfilled, onrejected) {
                    return this.parse().then(onfulfilled, onrejected);
                }
                catch(onrejected) {
                    return this.parse().catch(onrejected);
                }
                finally(onfinally) {
                    return this.parse().finally(onfinally);
                }
            }
            const brand_privateNullableHeaders = Symbol('brand.privateNullableHeaders');
            function* iterateHeaders(headers) {
                if (!headers) return;
                if (brand_privateNullableHeaders in headers) {
                    const { values, nulls } = headers;
                    yield* values.entries();
                    for (const name of nulls)yield [
                        name,
                        null
                    ];
                    return;
                }
                let shouldClear = false;
                let iter;
                if (headers instanceof Headers) iter = headers.entries();
                else if (isReadonlyArray(headers)) iter = headers;
                else {
                    shouldClear = true;
                    iter = Object.entries(headers !== null && headers !== void 0 ? headers : {});
                }
                for (let row of iter){
                    const name = row[0];
                    if (typeof name !== 'string') throw new TypeError('expected header name to be a string');
                    const values = isReadonlyArray(row[1]) ? row[1] : [
                        row[1]
                    ];
                    let didClear = false;
                    for (const value of values){
                        if (value === undefined) continue;
                        if (shouldClear && !didClear) {
                            didClear = true;
                            yield [
                                name,
                                null
                            ];
                        }
                        yield [
                            name,
                            value
                        ];
                    }
                }
            }
            const buildHeaders = (newHeaders)=>{
                const targetHeaders = new Headers();
                const nullHeaders = new Set();
                for (const headers of newHeaders){
                    const seenHeaders = new Set();
                    for (const [name, value] of iterateHeaders(headers)){
                        const lowerName = name.toLowerCase();
                        if (!seenHeaders.has(lowerName)) {
                            targetHeaders.delete(name);
                            seenHeaders.add(lowerName);
                        }
                        if (value === null) {
                            targetHeaders.delete(name);
                            nullHeaders.add(lowerName);
                        } else {
                            targetHeaders.append(name, value);
                            nullHeaders.delete(lowerName);
                        }
                    }
                }
                return {
                    [brand_privateNullableHeaders]: true,
                    values: targetHeaders,
                    nulls: nullHeaders
                };
            };
            const readEnv = (env)=>{
                var _a, _b, _c, _d, _e, _f;
                if (typeof globalThis.process !== 'undefined') return (_c = (_b = (_a = globalThis.process.env) === null || _a === void 0 ? void 0 : _a[env]) === null || _b === void 0 ? void 0 : _b.trim()) !== null && _c !== void 0 ? _c : undefined;
                if (typeof globalThis.Deno !== 'undefined') return (_f = (_e = (_d = globalThis.Deno.env) === null || _d === void 0 ? void 0 : _d.get) === null || _e === void 0 ? void 0 : _e.call(_d, env)) === null || _f === void 0 ? void 0 : _f.trim();
                return undefined;
            };
            var _a;
            class BaseGeminiNextGenAPIClient {
                constructor(_b){
                    var _c, _d, _e, _f, _g, _h, _j;
                    var { baseURL = readEnv('GEMINI_NEXT_GEN_API_BASE_URL'), apiKey = (_c = readEnv('GEMINI_API_KEY')) !== null && _c !== void 0 ? _c : null, apiVersion = 'v1beta' } = _b, opts = __rest(_b, [
                        "baseURL",
                        "apiKey",
                        "apiVersion"
                    ]);
                    const options = Object.assign(Object.assign({
                        apiKey,
                        apiVersion
                    }, opts), {
                        baseURL: baseURL || `https://generativelanguage.googleapis.com`
                    });
                    this.baseURL = options.baseURL;
                    this.timeout = (_d = options.timeout) !== null && _d !== void 0 ? _d : BaseGeminiNextGenAPIClient.DEFAULT_TIMEOUT;
                    this.logger = (_e = options.logger) !== null && _e !== void 0 ? _e : console;
                    const defaultLogLevel = 'warn';
                    this.logLevel = defaultLogLevel;
                    this.logLevel = (_g = (_f = parseLogLevel(options.logLevel, 'ClientOptions.logLevel', this)) !== null && _f !== void 0 ? _f : parseLogLevel(readEnv('GEMINI_NEXT_GEN_API_LOG'), "process.env['GEMINI_NEXT_GEN_API_LOG']", this)) !== null && _g !== void 0 ? _g : defaultLogLevel;
                    this.fetchOptions = options.fetchOptions;
                    this.maxRetries = (_h = options.maxRetries) !== null && _h !== void 0 ? _h : 2;
                    this.fetch = (_j = options.fetch) !== null && _j !== void 0 ? _j : getDefaultFetch();
                    this.encoder = FallbackEncoder;
                    this._options = options;
                    this.apiKey = apiKey;
                    this.apiVersion = apiVersion;
                    this.clientAdapter = options.clientAdapter;
                }
                withOptions(options) {
                    const client = new this.constructor(Object.assign(Object.assign(Object.assign({}, this._options), {
                        baseURL: this.baseURL,
                        maxRetries: this.maxRetries,
                        timeout: this.timeout,
                        logger: this.logger,
                        logLevel: this.logLevel,
                        fetch: this.fetch,
                        fetchOptions: this.fetchOptions,
                        apiKey: this.apiKey,
                        apiVersion: this.apiVersion
                    }), options));
                    return client;
                }
                baseURLOverridden() {
                    return this.baseURL !== 'https://generativelanguage.googleapis.com';
                }
                defaultQuery() {
                    return this._options.defaultQuery;
                }
                validateHeaders({ values, nulls }) {
                    if (values.has('authorization') || values.has('x-goog-api-key')) return;
                    if (this.apiKey && values.get('x-goog-api-key')) return;
                    if (nulls.has('x-goog-api-key')) return;
                    throw new Error('Could not resolve authentication method. Expected the apiKey to be set. Or for the "x-goog-api-key" headers to be explicitly omitted');
                }
                async authHeaders(opts) {
                    const existingHeaders = buildHeaders([
                        opts.headers
                    ]);
                    if (existingHeaders.values.has('authorization') || existingHeaders.values.has('x-goog-api-key')) return undefined;
                    if (this.apiKey) return buildHeaders([
                        {
                            'x-goog-api-key': this.apiKey
                        }
                    ]);
                    if (this.clientAdapter.isVertexAI()) return buildHeaders([
                        await this.clientAdapter.getAuthHeaders()
                    ]);
                    return undefined;
                }
                stringifyQuery(query) {
                    return Object.entries(query).filter(([_, value])=>typeof value !== 'undefined').map(([key, value])=>{
                        if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
                        if (value === null) return `${encodeURIComponent(key)}=`;
                        throw new GeminiNextGenAPIClientError(`Cannot stringify type ${typeof value}; Expected string, number, boolean, or null. If you need to pass nested query parameters, you can manually encode them, e.g. { query: { 'foo[key1]': value1, 'foo[key2]': value2 } }, and please open a GitHub issue requesting better support for your use case.`);
                    }).join('&');
                }
                getUserAgent() {
                    return `${this.constructor.name}/JS ${VERSION}`;
                }
                defaultIdempotencyKey() {
                    return `stainless-node-retry-${uuid4()}`;
                }
                makeStatusError(status, error, message, headers) {
                    return APIError.generate(status, error, message, headers);
                }
                buildURL(path, query, defaultBaseURL) {
                    const baseURL = !this.baseURLOverridden() && defaultBaseURL || this.baseURL;
                    const url = isAbsoluteURL(path) ? new URL(path) : new URL(baseURL + (baseURL.endsWith('/') && path.startsWith('/') ? path.slice(1) : path));
                    const defaultQuery = this.defaultQuery();
                    if (!isEmptyObj(defaultQuery)) query = Object.assign(Object.assign({}, defaultQuery), query);
                    if (typeof query === 'object' && query && !Array.isArray(query)) url.search = this.stringifyQuery(query);
                    return url.toString();
                }
                async prepareOptions(options) {
                    if (this.clientAdapter && this.clientAdapter.isVertexAI() && !options.path.startsWith(`/${this.apiVersion}/projects/`)) {
                        const oldPath = options.path.slice(this.apiVersion.length + 1);
                        options.path = `/${this.apiVersion}/projects/${this.clientAdapter.getProject()}/locations/${this.clientAdapter.getLocation()}${oldPath}`;
                    }
                }
                async prepareRequest(request, { url, options }) {}
                get(path, opts) {
                    return this.methodRequest('get', path, opts);
                }
                post(path, opts) {
                    return this.methodRequest('post', path, opts);
                }
                patch(path, opts) {
                    return this.methodRequest('patch', path, opts);
                }
                put(path, opts) {
                    return this.methodRequest('put', path, opts);
                }
                delete(path, opts) {
                    return this.methodRequest('delete', path, opts);
                }
                methodRequest(method, path, opts) {
                    return this.request(Promise.resolve(opts).then((opts)=>{
                        return Object.assign({
                            method,
                            path
                        }, opts);
                    }));
                }
                request(options, remainingRetries = null) {
                    return new APIPromise(this, this.makeRequest(options, remainingRetries, undefined));
                }
                async makeRequest(optionsInput, retriesRemaining, retryOfRequestLogID) {
                    var _b, _c, _d;
                    const options = await optionsInput;
                    const maxRetries = (_b = options.maxRetries) !== null && _b !== void 0 ? _b : this.maxRetries;
                    if (retriesRemaining == null) retriesRemaining = maxRetries;
                    await this.prepareOptions(options);
                    const { req, url, timeout } = await this.buildRequest(options, {
                        retryCount: maxRetries - retriesRemaining
                    });
                    await this.prepareRequest(req, {
                        url,
                        options
                    });
                    const requestLogID = 'log_' + (Math.random() * 16777216 | 0).toString(16).padStart(6, '0');
                    const retryLogStr = retryOfRequestLogID === undefined ? '' : `, retryOf: ${retryOfRequestLogID}`;
                    const startTime = Date.now();
                    loggerFor(this).debug(`[${requestLogID}] sending request`, formatRequestDetails({
                        retryOfRequestLogID,
                        method: options.method,
                        url,
                        options,
                        headers: req.headers
                    }));
                    if ((_c = options.signal) === null || _c === void 0 ? void 0 : _c.aborted) throw new APIUserAbortError();
                    const controller = new AbortController();
                    const response = await this.fetchWithTimeout(url, req, timeout, controller).catch(castToError);
                    const headersTime = Date.now();
                    if (response instanceof globalThis.Error) {
                        const retryMessage = `retrying, ${retriesRemaining} attempts remaining`;
                        if ((_d = options.signal) === null || _d === void 0 ? void 0 : _d.aborted) throw new APIUserAbortError();
                        const isTimeout = isAbortError(response) || /timed? ?out/i.test(String(response) + ('cause' in response ? String(response.cause) : ''));
                        if (retriesRemaining) {
                            loggerFor(this).info(`[${requestLogID}] connection ${isTimeout ? 'timed out' : 'failed'} - ${retryMessage}`);
                            loggerFor(this).debug(`[${requestLogID}] connection ${isTimeout ? 'timed out' : 'failed'} (${retryMessage})`, formatRequestDetails({
                                retryOfRequestLogID,
                                url,
                                durationMs: headersTime - startTime,
                                message: response.message
                            }));
                            return this.retryRequest(options, retriesRemaining, retryOfRequestLogID !== null && retryOfRequestLogID !== void 0 ? retryOfRequestLogID : requestLogID);
                        }
                        loggerFor(this).info(`[${requestLogID}] connection ${isTimeout ? 'timed out' : 'failed'} - error; no more retries left`);
                        loggerFor(this).debug(`[${requestLogID}] connection ${isTimeout ? 'timed out' : 'failed'} (error; no more retries left)`, formatRequestDetails({
                            retryOfRequestLogID,
                            url,
                            durationMs: headersTime - startTime,
                            message: response.message
                        }));
                        if (isTimeout) throw new APIConnectionTimeoutError();
                        throw new APIConnectionError({
                            cause: response
                        });
                    }
                    const responseInfo = `[${requestLogID}${retryLogStr}] ${req.method} ${url} ${response.ok ? 'succeeded' : 'failed'} with status ${response.status} in ${headersTime - startTime}ms`;
                    if (!response.ok) {
                        const shouldRetry = await this.shouldRetry(response);
                        if (retriesRemaining && shouldRetry) {
                            const retryMessage = `retrying, ${retriesRemaining} attempts remaining`;
                            await CancelReadableStream(response.body);
                            loggerFor(this).info(`${responseInfo} - ${retryMessage}`);
                            loggerFor(this).debug(`[${requestLogID}] response error (${retryMessage})`, formatRequestDetails({
                                retryOfRequestLogID,
                                url: response.url,
                                status: response.status,
                                headers: response.headers,
                                durationMs: headersTime - startTime
                            }));
                            return this.retryRequest(options, retriesRemaining, retryOfRequestLogID !== null && retryOfRequestLogID !== void 0 ? retryOfRequestLogID : requestLogID, response.headers);
                        }
                        const retryMessage = shouldRetry ? `error; no more retries left` : `error; not retryable`;
                        loggerFor(this).info(`${responseInfo} - ${retryMessage}`);
                        const errText = await response.text().catch((err)=>castToError(err).message);
                        const errJSON = safeJSON(errText);
                        const errMessage = errJSON ? undefined : errText;
                        loggerFor(this).debug(`[${requestLogID}] response error (${retryMessage})`, formatRequestDetails({
                            retryOfRequestLogID,
                            url: response.url,
                            status: response.status,
                            headers: response.headers,
                            message: errMessage,
                            durationMs: Date.now() - startTime
                        }));
                        const err = this.makeStatusError(response.status, errJSON, errMessage, response.headers);
                        throw err;
                    }
                    loggerFor(this).info(responseInfo);
                    loggerFor(this).debug(`[${requestLogID}] response start`, formatRequestDetails({
                        retryOfRequestLogID,
                        url: response.url,
                        status: response.status,
                        headers: response.headers,
                        durationMs: headersTime - startTime
                    }));
                    return {
                        response,
                        options,
                        controller,
                        requestLogID,
                        retryOfRequestLogID,
                        startTime
                    };
                }
                async fetchWithTimeout(url, init, ms, controller) {
                    const _b = init || {}, { signal, method } = _b, options = __rest(_b, [
                        "signal",
                        "method"
                    ]);
                    if (signal) signal.addEventListener('abort', ()=>controller.abort());
                    const timeout = setTimeout(()=>controller.abort(), ms);
                    const isReadableBody = globalThis.ReadableStream && options.body instanceof globalThis.ReadableStream || typeof options.body === 'object' && options.body !== null && Symbol.asyncIterator in options.body;
                    const fetchOptions = Object.assign(Object.assign(Object.assign({
                        signal: controller.signal
                    }, isReadableBody ? {
                        duplex: 'half'
                    } : {}), {
                        method: 'GET'
                    }), options);
                    if (method) fetchOptions.method = method.toUpperCase();
                    try {
                        return await this.fetch.call(undefined, url, fetchOptions);
                    } finally{
                        clearTimeout(timeout);
                    }
                }
                async shouldRetry(response) {
                    const shouldRetryHeader = response.headers.get('x-should-retry');
                    if (shouldRetryHeader === 'true') return true;
                    if (shouldRetryHeader === 'false') return false;
                    if (response.status === 408) return true;
                    if (response.status === 409) return true;
                    if (response.status === 429) return true;
                    if (response.status >= 500) return true;
                    return false;
                }
                async retryRequest(options, retriesRemaining, requestLogID, responseHeaders) {
                    var _b;
                    let timeoutMillis;
                    const retryAfterMillisHeader = responseHeaders === null || responseHeaders === void 0 ? void 0 : responseHeaders.get('retry-after-ms');
                    if (retryAfterMillisHeader) {
                        const timeoutMs = parseFloat(retryAfterMillisHeader);
                        if (!Number.isNaN(timeoutMs)) timeoutMillis = timeoutMs;
                    }
                    const retryAfterHeader = responseHeaders === null || responseHeaders === void 0 ? void 0 : responseHeaders.get('retry-after');
                    if (retryAfterHeader && !timeoutMillis) {
                        const timeoutSeconds = parseFloat(retryAfterHeader);
                        if (!Number.isNaN(timeoutSeconds)) timeoutMillis = timeoutSeconds * 1000;
                        else timeoutMillis = Date.parse(retryAfterHeader) - Date.now();
                    }
                    if (!(timeoutMillis && 0 <= timeoutMillis && timeoutMillis < 60000)) {
                        const maxRetries = (_b = options.maxRetries) !== null && _b !== void 0 ? _b : this.maxRetries;
                        timeoutMillis = this.calculateDefaultRetryTimeoutMillis(retriesRemaining, maxRetries);
                    }
                    await sleep$1(timeoutMillis);
                    return this.makeRequest(options, retriesRemaining - 1, requestLogID);
                }
                calculateDefaultRetryTimeoutMillis(retriesRemaining, maxRetries) {
                    const initialRetryDelay = 0.5;
                    const maxRetryDelay = 8.0;
                    const numRetries = maxRetries - retriesRemaining;
                    const sleepSeconds = Math.min(initialRetryDelay * Math.pow(2, numRetries), maxRetryDelay);
                    const jitter = 1 - Math.random() * 0.25;
                    return sleepSeconds * jitter * 1000;
                }
                async buildRequest(inputOptions, { retryCount = 0 } = {}) {
                    var _b, _c, _d;
                    const options = Object.assign({}, inputOptions);
                    const { method, path, query, defaultBaseURL } = options;
                    const url = this.buildURL(path, query, defaultBaseURL);
                    if ('timeout' in options) validatePositiveInteger('timeout', options.timeout);
                    options.timeout = (_b = options.timeout) !== null && _b !== void 0 ? _b : this.timeout;
                    const { bodyHeaders, body } = this.buildBody({
                        options
                    });
                    const reqHeaders = await this.buildHeaders({
                        options: inputOptions,
                        method,
                        bodyHeaders,
                        retryCount
                    });
                    const req = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({
                        method,
                        headers: reqHeaders
                    }, options.signal && {
                        signal: options.signal
                    }), globalThis.ReadableStream && body instanceof globalThis.ReadableStream && {
                        duplex: 'half'
                    }), body && {
                        body
                    }), (_c = this.fetchOptions) !== null && _c !== void 0 ? _c : {}), (_d = options.fetchOptions) !== null && _d !== void 0 ? _d : {});
                    return {
                        req,
                        url,
                        timeout: options.timeout
                    };
                }
                async buildHeaders({ options, method, bodyHeaders, retryCount }) {
                    let idempotencyHeaders = {};
                    if (this.idempotencyHeader && method !== 'get') {
                        if (!options.idempotencyKey) options.idempotencyKey = this.defaultIdempotencyKey();
                        idempotencyHeaders[this.idempotencyHeader] = options.idempotencyKey;
                    }
                    const authHeaders = await this.authHeaders(options);
                    let headers = buildHeaders([
                        idempotencyHeaders,
                        Object.assign(Object.assign({
                            Accept: 'application/json',
                            'User-Agent': this.getUserAgent(),
                            'X-Stainless-Retry-Count': String(retryCount)
                        }, options.timeout ? {
                            'X-Stainless-Timeout': String(Math.trunc(options.timeout / 1000))
                        } : {}), getPlatformHeaders()),
                        this._options.defaultHeaders,
                        bodyHeaders,
                        options.headers,
                        authHeaders
                    ]);
                    this.validateHeaders(headers);
                    return headers.values;
                }
                buildBody({ options: { body, headers: rawHeaders } }) {
                    if (!body) return {
                        bodyHeaders: undefined,
                        body: undefined
                    };
                    const headers = buildHeaders([
                        rawHeaders
                    ]);
                    if (ArrayBuffer.isView(body) || body instanceof ArrayBuffer || body instanceof DataView || typeof body === 'string' && headers.values.has('content-type') || globalThis.Blob && body instanceof globalThis.Blob || body instanceof FormData || body instanceof URLSearchParams || globalThis.ReadableStream && body instanceof globalThis.ReadableStream) return {
                        bodyHeaders: undefined,
                        body: body
                    };
                    else if (typeof body === 'object' && (Symbol.asyncIterator in body || Symbol.iterator in body && 'next' in body && typeof body.next === 'function')) return {
                        bodyHeaders: undefined,
                        body: ReadableStreamFrom(body)
                    };
                    else return this.encoder({
                        body,
                        headers
                    });
                }
            }
            BaseGeminiNextGenAPIClient.DEFAULT_TIMEOUT = 60000;
            class GeminiNextGenAPIClient extends BaseGeminiNextGenAPIClient {
                constructor(){
                    super(...arguments);
                    this.interactions = new Interactions(this);
                }
            }
            _a = GeminiNextGenAPIClient;
            GeminiNextGenAPIClient.GeminiNextGenAPIClient = _a;
            GeminiNextGenAPIClient.GeminiNextGenAPIClientError = GeminiNextGenAPIClientError;
            GeminiNextGenAPIClient.APIError = APIError;
            GeminiNextGenAPIClient.APIConnectionError = APIConnectionError;
            GeminiNextGenAPIClient.APIConnectionTimeoutError = APIConnectionTimeoutError;
            GeminiNextGenAPIClient.APIUserAbortError = APIUserAbortError;
            GeminiNextGenAPIClient.NotFoundError = NotFoundError;
            GeminiNextGenAPIClient.ConflictError = ConflictError;
            GeminiNextGenAPIClient.RateLimitError = RateLimitError;
            GeminiNextGenAPIClient.BadRequestError = BadRequestError;
            GeminiNextGenAPIClient.AuthenticationError = AuthenticationError;
            GeminiNextGenAPIClient.InternalServerError = InternalServerError;
            GeminiNextGenAPIClient.PermissionDeniedError = PermissionDeniedError;
            GeminiNextGenAPIClient.UnprocessableEntityError = UnprocessableEntityError;
            GeminiNextGenAPIClient.toFile = toFile;
            GeminiNextGenAPIClient.Interactions = Interactions;
            function cancelTuningJobParametersToMldev(fromObject, _rootObject) {
                const toObject = {};
                const fromName = getValueByPath(fromObject, [
                    'name'
                ]);
                if (fromName != null) setValueByPath(toObject, [
                    '_url',
                    'name'
                ], fromName);
                return toObject;
            }
            function cancelTuningJobParametersToVertex(fromObject, _rootObject) {
                const toObject = {};
                const fromName = getValueByPath(fromObject, [
                    'name'
                ]);
                if (fromName != null) setValueByPath(toObject, [
                    '_url',
                    'name'
                ], fromName);
                return toObject;
            }
            function cancelTuningJobResponseFromMldev(fromObject, _rootObject) {
                const toObject = {};
                const fromSdkHttpResponse = getValueByPath(fromObject, [
                    'sdkHttpResponse'
                ]);
                if (fromSdkHttpResponse != null) setValueByPath(toObject, [
                    'sdkHttpResponse'
                ], fromSdkHttpResponse);
                return toObject;
            }
            function cancelTuningJobResponseFromVertex(fromObject, _rootObject) {
                const toObject = {};
                const fromSdkHttpResponse = getValueByPath(fromObject, [
                    'sdkHttpResponse'
                ]);
                if (fromSdkHttpResponse != null) setValueByPath(toObject, [
                    'sdkHttpResponse'
                ], fromSdkHttpResponse);
                return toObject;
            }
            function createTuningJobConfigToMldev(fromObject, parentObject, _rootObject) {
                const toObject = {};
                if (getValueByPath(fromObject, [
                    'validationDataset'
                ]) !== undefined) throw new Error('validationDataset parameter is not supported in Gemini API.');
                const fromTunedModelDisplayName = getValueByPath(fromObject, [
                    'tunedModelDisplayName'
                ]);
                if (parentObject !== undefined && fromTunedModelDisplayName != null) setValueByPath(parentObject, [
                    'displayName'
                ], fromTunedModelDisplayName);
                if (getValueByPath(fromObject, [
                    'description'
                ]) !== undefined) throw new Error('description parameter is not supported in Gemini API.');
                const fromEpochCount = getValueByPath(fromObject, [
                    'epochCount'
                ]);
                if (parentObject !== undefined && fromEpochCount != null) setValueByPath(parentObject, [
                    'tuningTask',
                    'hyperparameters',
                    'epochCount'
                ], fromEpochCount);
                const fromLearningRateMultiplier = getValueByPath(fromObject, [
                    'learningRateMultiplier'
                ]);
                if (fromLearningRateMultiplier != null) setValueByPath(toObject, [
                    'tuningTask',
                    'hyperparameters',
                    'learningRateMultiplier'
                ], fromLearningRateMultiplier);
                if (getValueByPath(fromObject, [
                    'exportLastCheckpointOnly'
                ]) !== undefined) throw new Error('exportLastCheckpointOnly parameter is not supported in Gemini API.');
                if (getValueByPath(fromObject, [
                    'preTunedModelCheckpointId'
                ]) !== undefined) throw new Error('preTunedModelCheckpointId parameter is not supported in Gemini API.');
                if (getValueByPath(fromObject, [
                    'adapterSize'
                ]) !== undefined) throw new Error('adapterSize parameter is not supported in Gemini API.');
                const fromBatchSize = getValueByPath(fromObject, [
                    'batchSize'
                ]);
                if (parentObject !== undefined && fromBatchSize != null) setValueByPath(parentObject, [
                    'tuningTask',
                    'hyperparameters',
                    'batchSize'
                ], fromBatchSize);
                const fromLearningRate = getValueByPath(fromObject, [
                    'learningRate'
                ]);
                if (parentObject !== undefined && fromLearningRate != null) setValueByPath(parentObject, [
                    'tuningTask',
                    'hyperparameters',
                    'learningRate'
                ], fromLearningRate);
                if (getValueByPath(fromObject, [
                    'labels'
                ]) !== undefined) throw new Error('labels parameter is not supported in Gemini API.');
                if (getValueByPath(fromObject, [
                    'beta'
                ]) !== undefined) throw new Error('beta parameter is not supported in Gemini API.');
                return toObject;
            }
            function createTuningJobConfigToVertex(fromObject, parentObject, rootObject) {
                const toObject = {};
                let discriminatorValidationDataset = getValueByPath(rootObject, [
                    'config',
                    'method'
                ]);
                if (discriminatorValidationDataset === undefined) discriminatorValidationDataset = 'SUPERVISED_FINE_TUNING';
                if (discriminatorValidationDataset === 'SUPERVISED_FINE_TUNING') {
                    const fromValidationDataset = getValueByPath(fromObject, [
                        'validationDataset'
                    ]);
                    if (parentObject !== undefined && fromValidationDataset != null) setValueByPath(parentObject, [
                        'supervisedTuningSpec'
                    ], tuningValidationDatasetToVertex(fromValidationDataset));
                } else if (discriminatorValidationDataset === 'PREFERENCE_TUNING') {
                    const fromValidationDataset = getValueByPath(fromObject, [
                        'validationDataset'
                    ]);
                    if (parentObject !== undefined && fromValidationDataset != null) setValueByPath(parentObject, [
                        'preferenceOptimizationSpec'
                    ], tuningValidationDatasetToVertex(fromValidationDataset));
                }
                const fromTunedModelDisplayName = getValueByPath(fromObject, [
                    'tunedModelDisplayName'
                ]);
                if (parentObject !== undefined && fromTunedModelDisplayName != null) setValueByPath(parentObject, [
                    'tunedModelDisplayName'
                ], fromTunedModelDisplayName);
                const fromDescription = getValueByPath(fromObject, [
                    'description'
                ]);
                if (parentObject !== undefined && fromDescription != null) setValueByPath(parentObject, [
                    'description'
                ], fromDescription);
                let discriminatorEpochCount = getValueByPath(rootObject, [
                    'config',
                    'method'
                ]);
                if (discriminatorEpochCount === undefined) discriminatorEpochCount = 'SUPERVISED_FINE_TUNING';
                if (discriminatorEpochCount === 'SUPERVISED_FINE_TUNING') {
                    const fromEpochCount = getValueByPath(fromObject, [
                        'epochCount'
                    ]);
                    if (parentObject !== undefined && fromEpochCount != null) setValueByPath(parentObject, [
                        'supervisedTuningSpec',
                        'hyperParameters',
                        'epochCount'
                    ], fromEpochCount);
                } else if (discriminatorEpochCount === 'PREFERENCE_TUNING') {
                    const fromEpochCount = getValueByPath(fromObject, [
                        'epochCount'
                    ]);
                    if (parentObject !== undefined && fromEpochCount != null) setValueByPath(parentObject, [
                        'preferenceOptimizationSpec',
                        'hyperParameters',
                        'epochCount'
                    ], fromEpochCount);
                }
                let discriminatorLearningRateMultiplier = getValueByPath(rootObject, [
                    'config',
                    'method'
                ]);
                if (discriminatorLearningRateMultiplier === undefined) discriminatorLearningRateMultiplier = 'SUPERVISED_FINE_TUNING';
                if (discriminatorLearningRateMultiplier === 'SUPERVISED_FINE_TUNING') {
                    const fromLearningRateMultiplier = getValueByPath(fromObject, [
                        'learningRateMultiplier'
                    ]);
                    if (parentObject !== undefined && fromLearningRateMultiplier != null) setValueByPath(parentObject, [
                        'supervisedTuningSpec',
                        'hyperParameters',
                        'learningRateMultiplier'
                    ], fromLearningRateMultiplier);
                } else if (discriminatorLearningRateMultiplier === 'PREFERENCE_TUNING') {
                    const fromLearningRateMultiplier = getValueByPath(fromObject, [
                        'learningRateMultiplier'
                    ]);
                    if (parentObject !== undefined && fromLearningRateMultiplier != null) setValueByPath(parentObject, [
                        'preferenceOptimizationSpec',
                        'hyperParameters',
                        'learningRateMultiplier'
                    ], fromLearningRateMultiplier);
                }
                let discriminatorExportLastCheckpointOnly = getValueByPath(rootObject, [
                    'config',
                    'method'
                ]);
                if (discriminatorExportLastCheckpointOnly === undefined) discriminatorExportLastCheckpointOnly = 'SUPERVISED_FINE_TUNING';
                if (discriminatorExportLastCheckpointOnly === 'SUPERVISED_FINE_TUNING') {
                    const fromExportLastCheckpointOnly = getValueByPath(fromObject, [
                        'exportLastCheckpointOnly'
                    ]);
                    if (parentObject !== undefined && fromExportLastCheckpointOnly != null) setValueByPath(parentObject, [
                        'supervisedTuningSpec',
                        'exportLastCheckpointOnly'
                    ], fromExportLastCheckpointOnly);
                } else if (discriminatorExportLastCheckpointOnly === 'PREFERENCE_TUNING') {
                    const fromExportLastCheckpointOnly = getValueByPath(fromObject, [
                        'exportLastCheckpointOnly'
                    ]);
                    if (parentObject !== undefined && fromExportLastCheckpointOnly != null) setValueByPath(parentObject, [
                        'preferenceOptimizationSpec',
                        'exportLastCheckpointOnly'
                    ], fromExportLastCheckpointOnly);
                }
                let discriminatorAdapterSize = getValueByPath(rootObject, [
                    'config',
                    'method'
                ]);
                if (discriminatorAdapterSize === undefined) discriminatorAdapterSize = 'SUPERVISED_FINE_TUNING';
                if (discriminatorAdapterSize === 'SUPERVISED_FINE_TUNING') {
                    const fromAdapterSize = getValueByPath(fromObject, [
                        'adapterSize'
                    ]);
                    if (parentObject !== undefined && fromAdapterSize != null) setValueByPath(parentObject, [
                        'supervisedTuningSpec',
                        'hyperParameters',
                        'adapterSize'
                    ], fromAdapterSize);
                } else if (discriminatorAdapterSize === 'PREFERENCE_TUNING') {
                    const fromAdapterSize = getValueByPath(fromObject, [
                        'adapterSize'
                    ]);
                    if (parentObject !== undefined && fromAdapterSize != null) setValueByPath(parentObject, [
                        'preferenceOptimizationSpec',
                        'hyperParameters',
                        'adapterSize'
                    ], fromAdapterSize);
                }
                if (getValueByPath(fromObject, [
                    'batchSize'
                ]) !== undefined) throw new Error('batchSize parameter is not supported in Vertex AI.');
                if (getValueByPath(fromObject, [
                    'learningRate'
                ]) !== undefined) throw new Error('learningRate parameter is not supported in Vertex AI.');
                const fromLabels = getValueByPath(fromObject, [
                    'labels'
                ]);
                if (parentObject !== undefined && fromLabels != null) setValueByPath(parentObject, [
                    'labels'
                ], fromLabels);
                const fromBeta = getValueByPath(fromObject, [
                    'beta'
                ]);
                if (parentObject !== undefined && fromBeta != null) setValueByPath(parentObject, [
                    'preferenceOptimizationSpec',
                    'hyperParameters',
                    'beta'
                ], fromBeta);
                return toObject;
            }
            function createTuningJobParametersPrivateToMldev(fromObject, rootObject) {
                const toObject = {};
                const fromBaseModel = getValueByPath(fromObject, [
                    'baseModel'
                ]);
                if (fromBaseModel != null) setValueByPath(toObject, [
                    'baseModel'
                ], fromBaseModel);
                const fromPreTunedModel = getValueByPath(fromObject, [
                    'preTunedModel'
                ]);
                if (fromPreTunedModel != null) setValueByPath(toObject, [
                    'preTunedModel'
                ], fromPreTunedModel);
                const fromTrainingDataset = getValueByPath(fromObject, [
                    'trainingDataset'
                ]);
                if (fromTrainingDataset != null) tuningDatasetToMldev(fromTrainingDataset);
                const fromConfig = getValueByPath(fromObject, [
                    'config'
                ]);
                if (fromConfig != null) createTuningJobConfigToMldev(fromConfig, toObject);
                return toObject;
            }
            function createTuningJobParametersPrivateToVertex(fromObject, rootObject) {
                const toObject = {};
                const fromBaseModel = getValueByPath(fromObject, [
                    'baseModel'
                ]);
                if (fromBaseModel != null) setValueByPath(toObject, [
                    'baseModel'
                ], fromBaseModel);
                const fromPreTunedModel = getValueByPath(fromObject, [
                    'preTunedModel'
                ]);
                if (fromPreTunedModel != null) setValueByPath(toObject, [
                    'preTunedModel'
                ], fromPreTunedModel);
                const fromTrainingDataset = getValueByPath(fromObject, [
                    'trainingDataset'
                ]);
                if (fromTrainingDataset != null) tuningDatasetToVertex(fromTrainingDataset, toObject, rootObject);
                const fromConfig = getValueByPath(fromObject, [
                    'config'
                ]);
                if (fromConfig != null) createTuningJobConfigToVertex(fromConfig, toObject, rootObject);
                return toObject;
            }
            function getTuningJobParametersToMldev(fromObject, _rootObject) {
                const toObject = {};
                const fromName = getValueByPath(fromObject, [
                    'name'
                ]);
                if (fromName != null) setValueByPath(toObject, [
                    '_url',
                    'name'
                ], fromName);
                return toObject;
            }
            function getTuningJobParametersToVertex(fromObject, _rootObject) {
                const toObject = {};
                const fromName = getValueByPath(fromObject, [
                    'name'
                ]);
                if (fromName != null) setValueByPath(toObject, [
                    '_url',
                    'name'
                ], fromName);
                return toObject;
            }
            function listTuningJobsConfigToMldev(fromObject, parentObject, _rootObject) {
                const toObject = {};
                const fromPageSize = getValueByPath(fromObject, [
                    'pageSize'
                ]);
                if (parentObject !== undefined && fromPageSize != null) setValueByPath(parentObject, [
                    '_query',
                    'pageSize'
                ], fromPageSize);
                const fromPageToken = getValueByPath(fromObject, [
                    'pageToken'
                ]);
                if (parentObject !== undefined && fromPageToken != null) setValueByPath(parentObject, [
                    '_query',
                    'pageToken'
                ], fromPageToken);
                const fromFilter = getValueByPath(fromObject, [
                    'filter'
                ]);
                if (parentObject !== undefined && fromFilter != null) setValueByPath(parentObject, [
                    '_query',
                    'filter'
                ], fromFilter);
                return toObject;
            }
            function listTuningJobsConfigToVertex(fromObject, parentObject, _rootObject) {
                const toObject = {};
                const fromPageSize = getValueByPath(fromObject, [
                    'pageSize'
                ]);
                if (parentObject !== undefined && fromPageSize != null) setValueByPath(parentObject, [
                    '_query',
                    'pageSize'
                ], fromPageSize);
                const fromPageToken = getValueByPath(fromObject, [
                    'pageToken'
                ]);
                if (parentObject !== undefined && fromPageToken != null) setValueByPath(parentObject, [
                    '_query',
                    'pageToken'
                ], fromPageToken);
                const fromFilter = getValueByPath(fromObject, [
                    'filter'
                ]);
                if (parentObject !== undefined && fromFilter != null) setValueByPath(parentObject, [
                    '_query',
                    'filter'
                ], fromFilter);
                return toObject;
            }
            function listTuningJobsParametersToMldev(fromObject, rootObject) {
                const toObject = {};
                const fromConfig = getValueByPath(fromObject, [
                    'config'
                ]);
                if (fromConfig != null) listTuningJobsConfigToMldev(fromConfig, toObject);
                return toObject;
            }
            function listTuningJobsParametersToVertex(fromObject, rootObject) {
                const toObject = {};
                const fromConfig = getValueByPath(fromObject, [
                    'config'
                ]);
                if (fromConfig != null) listTuningJobsConfigToVertex(fromConfig, toObject);
                return toObject;
            }
            function listTuningJobsResponseFromMldev(fromObject, rootObject) {
                const toObject = {};
                const fromSdkHttpResponse = getValueByPath(fromObject, [
                    'sdkHttpResponse'
                ]);
                if (fromSdkHttpResponse != null) setValueByPath(toObject, [
                    'sdkHttpResponse'
                ], fromSdkHttpResponse);
                const fromNextPageToken = getValueByPath(fromObject, [
                    'nextPageToken'
                ]);
                if (fromNextPageToken != null) setValueByPath(toObject, [
                    'nextPageToken'
                ], fromNextPageToken);
                const fromTuningJobs = getValueByPath(fromObject, [
                    'tunedModels'
                ]);
                if (fromTuningJobs != null) {
                    let transformedList = fromTuningJobs;
                    if (Array.isArray(transformedList)) transformedList = transformedList.map((item)=>{
                        return tuningJobFromMldev(item);
                    });
                    setValueByPath(toObject, [
                        'tuningJobs'
                    ], transformedList);
                }
                return toObject;
            }
            function listTuningJobsResponseFromVertex(fromObject, rootObject) {
                const toObject = {};
                const fromSdkHttpResponse = getValueByPath(fromObject, [
                    'sdkHttpResponse'
                ]);
                if (fromSdkHttpResponse != null) setValueByPath(toObject, [
                    'sdkHttpResponse'
                ], fromSdkHttpResponse);
                const fromNextPageToken = getValueByPath(fromObject, [
                    'nextPageToken'
                ]);
                if (fromNextPageToken != null) setValueByPath(toObject, [
                    'nextPageToken'
                ], fromNextPageToken);
                const fromTuningJobs = getValueByPath(fromObject, [
                    'tuningJobs'
                ]);
                if (fromTuningJobs != null) {
                    let transformedList = fromTuningJobs;
                    if (Array.isArray(transformedList)) transformedList = transformedList.map((item)=>{
                        return tuningJobFromVertex(item);
                    });
                    setValueByPath(toObject, [
                        'tuningJobs'
                    ], transformedList);
                }
                return toObject;
            }
            function tunedModelFromMldev(fromObject, _rootObject) {
                const toObject = {};
                const fromModel = getValueByPath(fromObject, [
                    'name'
                ]);
                if (fromModel != null) setValueByPath(toObject, [
                    'model'
                ], fromModel);
                const fromEndpoint = getValueByPath(fromObject, [
                    'name'
                ]);
                if (fromEndpoint != null) setValueByPath(toObject, [
                    'endpoint'
                ], fromEndpoint);
                return toObject;
            }
            function tuningDatasetToMldev(fromObject, _rootObject) {
                const toObject = {};
                if (getValueByPath(fromObject, [
                    'gcsUri'
                ]) !== undefined) throw new Error('gcsUri parameter is not supported in Gemini API.');
                if (getValueByPath(fromObject, [
                    'vertexDatasetResource'
                ]) !== undefined) throw new Error('vertexDatasetResource parameter is not supported in Gemini API.');
                const fromExamples = getValueByPath(fromObject, [
                    'examples'
                ]);
                if (fromExamples != null) {
                    let transformedList = fromExamples;
                    if (Array.isArray(transformedList)) transformedList = transformedList.map((item)=>{
                        return item;
                    });
                    setValueByPath(toObject, [
                        'examples',
                        'examples'
                    ], transformedList);
                }
                return toObject;
            }
            function tuningDatasetToVertex(fromObject, parentObject, rootObject) {
                const toObject = {};
                let discriminatorGcsUri = getValueByPath(rootObject, [
                    'config',
                    'method'
                ]);
                if (discriminatorGcsUri === undefined) discriminatorGcsUri = 'SUPERVISED_FINE_TUNING';
                if (discriminatorGcsUri === 'SUPERVISED_FINE_TUNING') {
                    const fromGcsUri = getValueByPath(fromObject, [
                        'gcsUri'
                    ]);
                    if (parentObject !== undefined && fromGcsUri != null) setValueByPath(parentObject, [
                        'supervisedTuningSpec',
                        'trainingDatasetUri'
                    ], fromGcsUri);
                } else if (discriminatorGcsUri === 'PREFERENCE_TUNING') {
                    const fromGcsUri = getValueByPath(fromObject, [
                        'gcsUri'
                    ]);
                    if (parentObject !== undefined && fromGcsUri != null) setValueByPath(parentObject, [
                        'preferenceOptimizationSpec',
                        'trainingDatasetUri'
                    ], fromGcsUri);
                }
                let discriminatorVertexDatasetResource = getValueByPath(rootObject, [
                    'config',
                    'method'
                ]);
                if (discriminatorVertexDatasetResource === undefined) discriminatorVertexDatasetResource = 'SUPERVISED_FINE_TUNING';
                if (discriminatorVertexDatasetResource === 'SUPERVISED_FINE_TUNING') {
                    const fromVertexDatasetResource = getValueByPath(fromObject, [
                        'vertexDatasetResource'
                    ]);
                    if (parentObject !== undefined && fromVertexDatasetResource != null) setValueByPath(parentObject, [
                        'supervisedTuningSpec',
                        'trainingDatasetUri'
                    ], fromVertexDatasetResource);
                } else if (discriminatorVertexDatasetResource === 'PREFERENCE_TUNING') {
                    const fromVertexDatasetResource = getValueByPath(fromObject, [
                        'vertexDatasetResource'
                    ]);
                    if (parentObject !== undefined && fromVertexDatasetResource != null) setValueByPath(parentObject, [
                        'preferenceOptimizationSpec',
                        'trainingDatasetUri'
                    ], fromVertexDatasetResource);
                }
                if (getValueByPath(fromObject, [
                    'examples'
                ]) !== undefined) throw new Error('examples parameter is not supported in Vertex AI.');
                return toObject;
            }
            function tuningJobFromMldev(fromObject, rootObject) {
                const toObject = {};
                const fromSdkHttpResponse = getValueByPath(fromObject, [
                    'sdkHttpResponse'
                ]);
                if (fromSdkHttpResponse != null) setValueByPath(toObject, [
                    'sdkHttpResponse'
                ], fromSdkHttpResponse);
                const fromName = getValueByPath(fromObject, [
                    'name'
                ]);
                if (fromName != null) setValueByPath(toObject, [
                    'name'
                ], fromName);
                const fromState = getValueByPath(fromObject, [
                    'state'
                ]);
                if (fromState != null) setValueByPath(toObject, [
                    'state'
                ], tTuningJobStatus(fromState));
                const fromCreateTime = getValueByPath(fromObject, [
                    'createTime'
                ]);
                if (fromCreateTime != null) setValueByPath(toObject, [
                    'createTime'
                ], fromCreateTime);
                const fromStartTime = getValueByPath(fromObject, [
                    'tuningTask',
                    'startTime'
                ]);
                if (fromStartTime != null) setValueByPath(toObject, [
                    'startTime'
                ], fromStartTime);
                const fromEndTime = getValueByPath(fromObject, [
                    'tuningTask',
                    'completeTime'
                ]);
                if (fromEndTime != null) setValueByPath(toObject, [
                    'endTime'
                ], fromEndTime);
                const fromUpdateTime = getValueByPath(fromObject, [
                    'updateTime'
                ]);
                if (fromUpdateTime != null) setValueByPath(toObject, [
                    'updateTime'
                ], fromUpdateTime);
                const fromDescription = getValueByPath(fromObject, [
                    'description'
                ]);
                if (fromDescription != null) setValueByPath(toObject, [
                    'description'
                ], fromDescription);
                const fromBaseModel = getValueByPath(fromObject, [
                    'baseModel'
                ]);
                if (fromBaseModel != null) setValueByPath(toObject, [
                    'baseModel'
                ], fromBaseModel);
                const fromTunedModel = getValueByPath(fromObject, [
                    '_self'
                ]);
                if (fromTunedModel != null) setValueByPath(toObject, [
                    'tunedModel'
                ], tunedModelFromMldev(fromTunedModel));
                return toObject;
            }
            function tuningJobFromVertex(fromObject, _rootObject) {
                const toObject = {};
                const fromSdkHttpResponse = getValueByPath(fromObject, [
                    'sdkHttpResponse'
                ]);
                if (fromSdkHttpResponse != null) setValueByPath(toObject, [
                    'sdkHttpResponse'
                ], fromSdkHttpResponse);
                const fromName = getValueByPath(fromObject, [
                    'name'
                ]);
                if (fromName != null) setValueByPath(toObject, [
                    'name'
                ], fromName);
                const fromState = getValueByPath(fromObject, [
                    'state'
                ]);
                if (fromState != null) setValueByPath(toObject, [
                    'state'
                ], tTuningJobStatus(fromState));
                const fromCreateTime = getValueByPath(fromObject, [
                    'createTime'
                ]);
                if (fromCreateTime != null) setValueByPath(toObject, [
                    'createTime'
                ], fromCreateTime);
                const fromStartTime = getValueByPath(fromObject, [
                    'startTime'
                ]);
                if (fromStartTime != null) setValueByPath(toObject, [
                    'startTime'
                ], fromStartTime);
                const fromEndTime = getValueByPath(fromObject, [
                    'endTime'
                ]);
                if (fromEndTime != null) setValueByPath(toObject, [
                    'endTime'
                ], fromEndTime);
                const fromUpdateTime = getValueByPath(fromObject, [
                    'updateTime'
                ]);
                if (fromUpdateTime != null) setValueByPath(toObject, [
                    'updateTime'
                ], fromUpdateTime);
                const fromError = getValueByPath(fromObject, [
                    'error'
                ]);
                if (fromError != null) setValueByPath(toObject, [
                    'error'
                ], fromError);
                const fromDescription = getValueByPath(fromObject, [
                    'description'
                ]);
                if (fromDescription != null) setValueByPath(toObject, [
                    'description'
                ], fromDescription);
                const fromBaseModel = getValueByPath(fromObject, [
                    'baseModel'
                ]);
                if (fromBaseModel != null) setValueByPath(toObject, [
                    'baseModel'
                ], fromBaseModel);
                const fromTunedModel = getValueByPath(fromObject, [
                    'tunedModel'
                ]);
                if (fromTunedModel != null) setValueByPath(toObject, [
                    'tunedModel'
                ], fromTunedModel);
                const fromPreTunedModel = getValueByPath(fromObject, [
                    'preTunedModel'
                ]);
                if (fromPreTunedModel != null) setValueByPath(toObject, [
                    'preTunedModel'
                ], fromPreTunedModel);
                const fromSupervisedTuningSpec = getValueByPath(fromObject, [
                    'supervisedTuningSpec'
                ]);
                if (fromSupervisedTuningSpec != null) setValueByPath(toObject, [
                    'supervisedTuningSpec'
                ], fromSupervisedTuningSpec);
                const fromPreferenceOptimizationSpec = getValueByPath(fromObject, [
                    'preferenceOptimizationSpec'
                ]);
                if (fromPreferenceOptimizationSpec != null) setValueByPath(toObject, [
                    'preferenceOptimizationSpec'
                ], fromPreferenceOptimizationSpec);
                const fromTuningDataStats = getValueByPath(fromObject, [
                    'tuningDataStats'
                ]);
                if (fromTuningDataStats != null) setValueByPath(toObject, [
                    'tuningDataStats'
                ], fromTuningDataStats);
                const fromEncryptionSpec = getValueByPath(fromObject, [
                    'encryptionSpec'
                ]);
                if (fromEncryptionSpec != null) setValueByPath(toObject, [
                    'encryptionSpec'
                ], fromEncryptionSpec);
                const fromPartnerModelTuningSpec = getValueByPath(fromObject, [
                    'partnerModelTuningSpec'
                ]);
                if (fromPartnerModelTuningSpec != null) setValueByPath(toObject, [
                    'partnerModelTuningSpec'
                ], fromPartnerModelTuningSpec);
                const fromCustomBaseModel = getValueByPath(fromObject, [
                    'customBaseModel'
                ]);
                if (fromCustomBaseModel != null) setValueByPath(toObject, [
                    'customBaseModel'
                ], fromCustomBaseModel);
                const fromExperiment = getValueByPath(fromObject, [
                    'experiment'
                ]);
                if (fromExperiment != null) setValueByPath(toObject, [
                    'experiment'
                ], fromExperiment);
                const fromLabels = getValueByPath(fromObject, [
                    'labels'
                ]);
                if (fromLabels != null) setValueByPath(toObject, [
                    'labels'
                ], fromLabels);
                const fromOutputUri = getValueByPath(fromObject, [
                    'outputUri'
                ]);
                if (fromOutputUri != null) setValueByPath(toObject, [
                    'outputUri'
                ], fromOutputUri);
                const fromPipelineJob = getValueByPath(fromObject, [
                    'pipelineJob'
                ]);
                if (fromPipelineJob != null) setValueByPath(toObject, [
                    'pipelineJob'
                ], fromPipelineJob);
                const fromServiceAccount = getValueByPath(fromObject, [
                    'serviceAccount'
                ]);
                if (fromServiceAccount != null) setValueByPath(toObject, [
                    'serviceAccount'
                ], fromServiceAccount);
                const fromTunedModelDisplayName = getValueByPath(fromObject, [
                    'tunedModelDisplayName'
                ]);
                if (fromTunedModelDisplayName != null) setValueByPath(toObject, [
                    'tunedModelDisplayName'
                ], fromTunedModelDisplayName);
                const fromVeoTuningSpec = getValueByPath(fromObject, [
                    'veoTuningSpec'
                ]);
                if (fromVeoTuningSpec != null) setValueByPath(toObject, [
                    'veoTuningSpec'
                ], fromVeoTuningSpec);
                return toObject;
            }
            function tuningOperationFromMldev(fromObject, _rootObject) {
                const toObject = {};
                const fromSdkHttpResponse = getValueByPath(fromObject, [
                    'sdkHttpResponse'
                ]);
                if (fromSdkHttpResponse != null) setValueByPath(toObject, [
                    'sdkHttpResponse'
                ], fromSdkHttpResponse);
                const fromName = getValueByPath(fromObject, [
                    'name'
                ]);
                if (fromName != null) setValueByPath(toObject, [
                    'name'
                ], fromName);
                const fromMetadata = getValueByPath(fromObject, [
                    'metadata'
                ]);
                if (fromMetadata != null) setValueByPath(toObject, [
                    'metadata'
                ], fromMetadata);
                const fromDone = getValueByPath(fromObject, [
                    'done'
                ]);
                if (fromDone != null) setValueByPath(toObject, [
                    'done'
                ], fromDone);
                const fromError = getValueByPath(fromObject, [
                    'error'
                ]);
                if (fromError != null) setValueByPath(toObject, [
                    'error'
                ], fromError);
                return toObject;
            }
            function tuningValidationDatasetToVertex(fromObject, _rootObject) {
                const toObject = {};
                const fromGcsUri = getValueByPath(fromObject, [
                    'gcsUri'
                ]);
                if (fromGcsUri != null) setValueByPath(toObject, [
                    'validationDatasetUri'
                ], fromGcsUri);
                const fromVertexDatasetResource = getValueByPath(fromObject, [
                    'vertexDatasetResource'
                ]);
                if (fromVertexDatasetResource != null) setValueByPath(toObject, [
                    'validationDatasetUri'
                ], fromVertexDatasetResource);
                return toObject;
            }
            class Tunings extends BaseModule {
                constructor(apiClient){
                    super();
                    this.apiClient = apiClient;
                    this.list = async (params = {})=>{
                        return new Pager(PagedItem.PAGED_ITEM_TUNING_JOBS, (x)=>this.listInternal(x), await this.listInternal(params), params);
                    };
                    this.get = async (params)=>{
                        return await this.getInternal(params);
                    };
                    this.tune = async (params)=>{
                        var _a;
                        if (this.apiClient.isVertexAI()) {
                            if (params.baseModel.startsWith('projects/')) {
                                const preTunedModel = {
                                    tunedModelName: params.baseModel
                                };
                                if ((_a = params.config) === null || _a === void 0 ? void 0 : _a.preTunedModelCheckpointId) preTunedModel.checkpointId = params.config.preTunedModelCheckpointId;
                                const paramsPrivate = Object.assign(Object.assign({}, params), {
                                    preTunedModel: preTunedModel
                                });
                                paramsPrivate.baseModel = undefined;
                                return await this.tuneInternal(paramsPrivate);
                            } else {
                                const paramsPrivate = Object.assign({}, params);
                                return await this.tuneInternal(paramsPrivate);
                            }
                        } else {
                            const paramsPrivate = Object.assign({}, params);
                            const operation = await this.tuneMldevInternal(paramsPrivate);
                            let tunedModelName = '';
                            if (operation['metadata'] !== undefined && operation['metadata']['tunedModel'] !== undefined) tunedModelName = operation['metadata']['tunedModel'];
                            else if (operation['name'] !== undefined && operation['name'].includes('/operations/')) tunedModelName = operation['name'].split('/operations/')[0];
                            const tuningJob = {
                                name: tunedModelName,
                                state: JobState.JOB_STATE_QUEUED
                            };
                            return tuningJob;
                        }
                    };
                }
                async getInternal(params) {
                    var _a, _b, _c, _d;
                    let response;
                    let path = '';
                    let queryParams = {};
                    if (this.apiClient.isVertexAI()) {
                        const body = getTuningJobParametersToVertex(params);
                        path = formatMap('{name}', body['_url']);
                        queryParams = body['_query'];
                        delete body['_url'];
                        delete body['_query'];
                        response = this.apiClient.request({
                            path: path,
                            queryParams: queryParams,
                            body: JSON.stringify(body),
                            httpMethod: 'GET',
                            httpOptions: (_a = params.config) === null || _a === void 0 ? void 0 : _a.httpOptions,
                            abortSignal: (_b = params.config) === null || _b === void 0 ? void 0 : _b.abortSignal
                        }).then((httpResponse)=>{
                            return httpResponse.json().then((jsonResponse)=>{
                                const response = jsonResponse;
                                response.sdkHttpResponse = {
                                    headers: httpResponse.headers
                                };
                                return response;
                            });
                        });
                        return response.then((apiResponse)=>{
                            const resp = tuningJobFromVertex(apiResponse);
                            return resp;
                        });
                    } else {
                        const body = getTuningJobParametersToMldev(params);
                        path = formatMap('{name}', body['_url']);
                        queryParams = body['_query'];
                        delete body['_url'];
                        delete body['_query'];
                        response = this.apiClient.request({
                            path: path,
                            queryParams: queryParams,
                            body: JSON.stringify(body),
                            httpMethod: 'GET',
                            httpOptions: (_c = params.config) === null || _c === void 0 ? void 0 : _c.httpOptions,
                            abortSignal: (_d = params.config) === null || _d === void 0 ? void 0 : _d.abortSignal
                        }).then((httpResponse)=>{
                            return httpResponse.json().then((jsonResponse)=>{
                                const response = jsonResponse;
                                response.sdkHttpResponse = {
                                    headers: httpResponse.headers
                                };
                                return response;
                            });
                        });
                        return response.then((apiResponse)=>{
                            const resp = tuningJobFromMldev(apiResponse);
                            return resp;
                        });
                    }
                }
                async listInternal(params) {
                    var _a, _b, _c, _d;
                    let response;
                    let path = '';
                    let queryParams = {};
                    if (this.apiClient.isVertexAI()) {
                        const body = listTuningJobsParametersToVertex(params);
                        path = formatMap('tuningJobs', body['_url']);
                        queryParams = body['_query'];
                        delete body['_url'];
                        delete body['_query'];
                        response = this.apiClient.request({
                            path: path,
                            queryParams: queryParams,
                            body: JSON.stringify(body),
                            httpMethod: 'GET',
                            httpOptions: (_a = params.config) === null || _a === void 0 ? void 0 : _a.httpOptions,
                            abortSignal: (_b = params.config) === null || _b === void 0 ? void 0 : _b.abortSignal
                        }).then((httpResponse)=>{
                            return httpResponse.json().then((jsonResponse)=>{
                                const response = jsonResponse;
                                response.sdkHttpResponse = {
                                    headers: httpResponse.headers
                                };
                                return response;
                            });
                        });
                        return response.then((apiResponse)=>{
                            const resp = listTuningJobsResponseFromVertex(apiResponse);
                            const typedResp = new ListTuningJobsResponse();
                            Object.assign(typedResp, resp);
                            return typedResp;
                        });
                    } else {
                        const body = listTuningJobsParametersToMldev(params);
                        path = formatMap('tunedModels', body['_url']);
                        queryParams = body['_query'];
                        delete body['_url'];
                        delete body['_query'];
                        response = this.apiClient.request({
                            path: path,
                            queryParams: queryParams,
                            body: JSON.stringify(body),
                            httpMethod: 'GET',
                            httpOptions: (_c = params.config) === null || _c === void 0 ? void 0 : _c.httpOptions,
                            abortSignal: (_d = params.config) === null || _d === void 0 ? void 0 : _d.abortSignal
                        }).then((httpResponse)=>{
                            return httpResponse.json().then((jsonResponse)=>{
                                const response = jsonResponse;
                                response.sdkHttpResponse = {
                                    headers: httpResponse.headers
                                };
                                return response;
                            });
                        });
                        return response.then((apiResponse)=>{
                            const resp = listTuningJobsResponseFromMldev(apiResponse);
                            const typedResp = new ListTuningJobsResponse();
                            Object.assign(typedResp, resp);
                            return typedResp;
                        });
                    }
                }
                async cancel(params) {
                    var _a, _b, _c, _d;
                    let response;
                    let path = '';
                    let queryParams = {};
                    if (this.apiClient.isVertexAI()) {
                        const body = cancelTuningJobParametersToVertex(params);
                        path = formatMap('{name}:cancel', body['_url']);
                        queryParams = body['_query'];
                        delete body['_url'];
                        delete body['_query'];
                        response = this.apiClient.request({
                            path: path,
                            queryParams: queryParams,
                            body: JSON.stringify(body),
                            httpMethod: 'POST',
                            httpOptions: (_a = params.config) === null || _a === void 0 ? void 0 : _a.httpOptions,
                            abortSignal: (_b = params.config) === null || _b === void 0 ? void 0 : _b.abortSignal
                        }).then((httpResponse)=>{
                            return httpResponse.json().then((jsonResponse)=>{
                                const response = jsonResponse;
                                response.sdkHttpResponse = {
                                    headers: httpResponse.headers
                                };
                                return response;
                            });
                        });
                        return response.then((apiResponse)=>{
                            const resp = cancelTuningJobResponseFromVertex(apiResponse);
                            const typedResp = new CancelTuningJobResponse();
                            Object.assign(typedResp, resp);
                            return typedResp;
                        });
                    } else {
                        const body = cancelTuningJobParametersToMldev(params);
                        path = formatMap('{name}:cancel', body['_url']);
                        queryParams = body['_query'];
                        delete body['_url'];
                        delete body['_query'];
                        response = this.apiClient.request({
                            path: path,
                            queryParams: queryParams,
                            body: JSON.stringify(body),
                            httpMethod: 'POST',
                            httpOptions: (_c = params.config) === null || _c === void 0 ? void 0 : _c.httpOptions,
                            abortSignal: (_d = params.config) === null || _d === void 0 ? void 0 : _d.abortSignal
                        }).then((httpResponse)=>{
                            return httpResponse.json().then((jsonResponse)=>{
                                const response = jsonResponse;
                                response.sdkHttpResponse = {
                                    headers: httpResponse.headers
                                };
                                return response;
                            });
                        });
                        return response.then((apiResponse)=>{
                            const resp = cancelTuningJobResponseFromMldev(apiResponse);
                            const typedResp = new CancelTuningJobResponse();
                            Object.assign(typedResp, resp);
                            return typedResp;
                        });
                    }
                }
                async tuneInternal(params) {
                    var _a, _b;
                    let response;
                    let path = '';
                    let queryParams = {};
                    if (this.apiClient.isVertexAI()) {
                        const body = createTuningJobParametersPrivateToVertex(params, params);
                        path = formatMap('tuningJobs', body['_url']);
                        queryParams = body['_query'];
                        delete body['_url'];
                        delete body['_query'];
                        response = this.apiClient.request({
                            path: path,
                            queryParams: queryParams,
                            body: JSON.stringify(body),
                            httpMethod: 'POST',
                            httpOptions: (_a = params.config) === null || _a === void 0 ? void 0 : _a.httpOptions,
                            abortSignal: (_b = params.config) === null || _b === void 0 ? void 0 : _b.abortSignal
                        }).then((httpResponse)=>{
                            return httpResponse.json().then((jsonResponse)=>{
                                const response = jsonResponse;
                                response.sdkHttpResponse = {
                                    headers: httpResponse.headers
                                };
                                return response;
                            });
                        });
                        return response.then((apiResponse)=>{
                            const resp = tuningJobFromVertex(apiResponse);
                            return resp;
                        });
                    } else throw new Error('This method is only supported by the Vertex AI.');
                }
                async tuneMldevInternal(params) {
                    var _a, _b;
                    let response;
                    let path = '';
                    let queryParams = {};
                    if (this.apiClient.isVertexAI()) throw new Error('This method is only supported by the Gemini Developer API.');
                    else {
                        const body = createTuningJobParametersPrivateToMldev(params);
                        path = formatMap('tunedModels', body['_url']);
                        queryParams = body['_query'];
                        delete body['_url'];
                        delete body['_query'];
                        response = this.apiClient.request({
                            path: path,
                            queryParams: queryParams,
                            body: JSON.stringify(body),
                            httpMethod: 'POST',
                            httpOptions: (_a = params.config) === null || _a === void 0 ? void 0 : _a.httpOptions,
                            abortSignal: (_b = params.config) === null || _b === void 0 ? void 0 : _b.abortSignal
                        }).then((httpResponse)=>{
                            return httpResponse.json().then((jsonResponse)=>{
                                const response = jsonResponse;
                                response.sdkHttpResponse = {
                                    headers: httpResponse.headers
                                };
                                return response;
                            });
                        });
                        return response.then((apiResponse)=>{
                            const resp = tuningOperationFromMldev(apiResponse);
                            return resp;
                        });
                    }
                }
            }
            class BrowserDownloader {
                async download(_params, _apiClient) {
                    throw new Error('Download to file is not supported in the browser, please use a browser compliant download like an <a> tag.');
                }
            }
            const MAX_CHUNK_SIZE = 8388608;
            const MAX_RETRY_COUNT = 3;
            const INITIAL_RETRY_DELAY_MS = 1000;
            const DELAY_MULTIPLIER = 2;
            const X_GOOG_UPLOAD_STATUS_HEADER_FIELD = 'x-goog-upload-status';
            async function uploadBlob(file, uploadUrl, apiClient) {
                var _a;
                const response = await uploadBlobInternal(file, uploadUrl, apiClient);
                const responseJson = await (response === null || response === void 0 ? void 0 : response.json());
                if (((_a = response === null || response === void 0 ? void 0 : response.headers) === null || _a === void 0 ? void 0 : _a[X_GOOG_UPLOAD_STATUS_HEADER_FIELD]) !== 'final') throw new Error('Failed to upload file: Upload status is not finalized.');
                return responseJson['file'];
            }
            async function uploadBlobToFileSearchStore(file, uploadUrl, apiClient) {
                var _a;
                const response = await uploadBlobInternal(file, uploadUrl, apiClient);
                const responseJson = await (response === null || response === void 0 ? void 0 : response.json());
                if (((_a = response === null || response === void 0 ? void 0 : response.headers) === null || _a === void 0 ? void 0 : _a[X_GOOG_UPLOAD_STATUS_HEADER_FIELD]) !== 'final') throw new Error('Failed to upload file: Upload status is not finalized.');
                const resp = uploadToFileSearchStoreOperationFromMldev(responseJson);
                const typedResp = new UploadToFileSearchStoreOperation();
                Object.assign(typedResp, resp);
                return typedResp;
            }
            async function uploadBlobInternal(file, uploadUrl, apiClient) {
                var _a, _b;
                let fileSize = 0;
                let offset = 0;
                let response = new HttpResponse(new Response());
                let uploadCommand = 'upload';
                fileSize = file.size;
                while(offset < fileSize){
                    const chunkSize = Math.min(MAX_CHUNK_SIZE, fileSize - offset);
                    const chunk = file.slice(offset, offset + chunkSize);
                    if (offset + chunkSize >= fileSize) uploadCommand += ', finalize';
                    let retryCount = 0;
                    let currentDelayMs = INITIAL_RETRY_DELAY_MS;
                    while(retryCount < MAX_RETRY_COUNT){
                        response = await apiClient.request({
                            path: '',
                            body: chunk,
                            httpMethod: 'POST',
                            httpOptions: {
                                apiVersion: '',
                                baseUrl: uploadUrl,
                                headers: {
                                    'X-Goog-Upload-Command': uploadCommand,
                                    'X-Goog-Upload-Offset': String(offset),
                                    'Content-Length': String(chunkSize)
                                }
                            }
                        });
                        if ((_a = response === null || response === void 0 ? void 0 : response.headers) === null || _a === void 0 ? void 0 : _a[X_GOOG_UPLOAD_STATUS_HEADER_FIELD]) break;
                        retryCount++;
                        await sleep(currentDelayMs);
                        currentDelayMs = currentDelayMs * DELAY_MULTIPLIER;
                    }
                    offset += chunkSize;
                    if (((_b = response === null || response === void 0 ? void 0 : response.headers) === null || _b === void 0 ? void 0 : _b[X_GOOG_UPLOAD_STATUS_HEADER_FIELD]) !== 'active') break;
                    if (fileSize <= offset) throw new Error('All content has been uploaded, but the upload status is not finalized.');
                }
                return response;
            }
            async function getBlobStat(file) {
                const fileStat = {
                    size: file.size,
                    type: file.type
                };
                return fileStat;
            }
            function sleep(ms) {
                return new Promise((resolvePromise)=>setTimeout(resolvePromise, ms));
            }
            class BrowserUploader {
                async upload(file, uploadUrl, apiClient) {
                    if (typeof file === 'string') throw new Error('File path is not supported in browser uploader.');
                    return await uploadBlob(file, uploadUrl, apiClient);
                }
                async uploadToFileSearchStore(file, uploadUrl, apiClient) {
                    if (typeof file === 'string') throw new Error('File path is not supported in browser uploader.');
                    return await uploadBlobToFileSearchStore(file, uploadUrl, apiClient);
                }
                async stat(file) {
                    if (typeof file === 'string') throw new Error('File path is not supported in browser uploader.');
                    else return await getBlobStat(file);
                }
            }
            class BrowserWebSocketFactory {
                create(url, headers, callbacks) {
                    return new BrowserWebSocket(url, headers, callbacks);
                }
            }
            class BrowserWebSocket {
                constructor(url, headers, callbacks){
                    this.url = url;
                    this.headers = headers;
                    this.callbacks = callbacks;
                }
                connect() {
                    this.ws = new WebSocket(this.url);
                    this.ws.onopen = this.callbacks.onopen;
                    this.ws.onerror = this.callbacks.onerror;
                    this.ws.onclose = this.callbacks.onclose;
                    this.ws.onmessage = this.callbacks.onmessage;
                }
                send(message) {
                    if (this.ws === undefined) throw new Error('WebSocket is not connected');
                    this.ws.send(message);
                }
                close() {
                    if (this.ws === undefined) throw new Error('WebSocket is not connected');
                    this.ws.close();
                }
            }
            const GOOGLE_API_KEY_HEADER = 'x-goog-api-key';
            class WebAuth {
                constructor(apiKey){
                    this.apiKey = apiKey;
                }
                async addAuthHeaders(headers, url) {
                    if (headers.get(GOOGLE_API_KEY_HEADER) !== null) return;
                    if (this.apiKey.startsWith('auth_tokens/')) throw new Error('Ephemeral tokens are only supported by the live API.');
                    if (!this.apiKey) throw new Error('API key is missing. Please provide a valid API key.');
                    headers.append(GOOGLE_API_KEY_HEADER, this.apiKey);
                }
            }
            const LANGUAGE_LABEL_PREFIX = 'gl-node/';
            class GoogleGenAI {
                get interactions() {
                    if (this._interactions !== undefined) return this._interactions;
                    console.warn('GoogleGenAI.interactions: Interactions usage is experimental and may change in future versions.');
                    const httpOpts = this.httpOptions;
                    if (httpOpts === null || httpOpts === void 0 ? void 0 : httpOpts.extraBody) console.warn('GoogleGenAI.interactions: Client level httpOptions.extraBody is not supported by the interactions client and will be ignored.');
                    const nextGenClient = new GeminiNextGenAPIClient({
                        baseURL: this.apiClient.getBaseUrl(),
                        apiKey: this.apiKey,
                        apiVersion: this.apiClient.getApiVersion(),
                        clientAdapter: this.apiClient,
                        defaultHeaders: this.apiClient.getDefaultHeaders(),
                        timeout: httpOpts === null || httpOpts === void 0 ? void 0 : httpOpts.timeout
                    });
                    this._interactions = nextGenClient.interactions;
                    return this._interactions;
                }
                constructor(options){
                    var _a;
                    if (options.apiKey == null) throw new Error('An API Key must be set when running in a browser');
                    if (options.project || options.location) throw new Error('Vertex AI project based authentication is not supported on browser runtimes. Please do not provide a project or location.');
                    this.vertexai = (_a = options.vertexai) !== null && _a !== void 0 ? _a : false;
                    this.apiKey = options.apiKey;
                    const baseUrl = getBaseUrl(options.httpOptions, options.vertexai, undefined, undefined);
                    if (baseUrl) {
                        if (options.httpOptions) options.httpOptions.baseUrl = baseUrl;
                        else options.httpOptions = {
                            baseUrl: baseUrl
                        };
                    }
                    this.apiVersion = options.apiVersion;
                    this.httpOptions = options.httpOptions;
                    const auth = new WebAuth(this.apiKey);
                    this.apiClient = new ApiClient({
                        auth: auth,
                        apiVersion: this.apiVersion,
                        apiKey: this.apiKey,
                        vertexai: this.vertexai,
                        httpOptions: this.httpOptions,
                        userAgentExtra: LANGUAGE_LABEL_PREFIX + 'web',
                        uploader: new BrowserUploader(),
                        downloader: new BrowserDownloader()
                    });
                    this.models = new Models(this.apiClient);
                    this.live = new Live(this.apiClient, auth, new BrowserWebSocketFactory());
                    this.batches = new Batches(this.apiClient);
                    this.chats = new Chats(this.models, this.apiClient);
                    this.caches = new Caches(this.apiClient);
                    this.files = new Files(this.apiClient);
                    this.operations = new Operations(this.apiClient);
                    this.authTokens = new Tokens(this.apiClient);
                    this.tunings = new Tunings(this.apiClient);
                    this.fileSearchStores = new FileSearchStores(this.apiClient);
                }
            }
        }
    }
}, function(runtime) {
    runtime._h = '12529692599258949215';
    runtime.updateEnsure2Map({
        "src/.umi/plugin-layout/Layout.tsx": [
            "vendors",
            "src/.umi/plugin-layout/Layout.tsx"
        ],
        "src/.umi/plugin-openapi/openapi.tsx": [
            "vendors",
            "src/.umi/plugin-openapi/openapi.tsx"
        ],
        "src/pages/404.tsx": [
            "p__404"
        ],
        "src/pages/about/index.tsx": [
            "vendors",
            "p__about__index"
        ],
        "src/pages/ai-setting/index.tsx": [
            "vendors",
            "common",
            "src/pages/ai-setting/index.tsx"
        ],
        "src/pages/changelog/index.tsx": [
            "vendors",
            "p__changelog__index"
        ],
        "src/pages/lyrics-craft/index.tsx": [
            "vendors",
            "common",
            "src/pages/lyrics-craft/index.tsx"
        ],
        "src/pages/lyrics-records/index.tsx": [
            "vendors",
            "common",
            "src/pages/lyrics-records/index.tsx"
        ],
        "src/pages/record/index.tsx": [
            "vendors",
            "common",
            "p__record__index"
        ],
        "src/pages/suno-cover/index.tsx": [
            "vendors",
            "common",
            "src/pages/suno-cover/index.tsx"
        ]
    });
    ;
});

//# sourceMappingURL=p__record__index-async.14975639527807667370.hot-update.js.map