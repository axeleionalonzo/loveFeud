			$(document).ready(function() {
				document.addEventListener("deviceready", onDeviceReady, false);
				var db = window.openDatabase("Database", "1.0", "LoveFeud", 200000);
				var resource;

				function onDeviceReady() {
					db.transaction(populateDB, errorCB, successCB);
					document.addEventListener('backbutton', onBack, false)
				}

				function onBack() {
					if ($.mobile.activePage.is('#index')) {
						navigator.app.exitApp()
					} else {
						db.transaction(queryDB, errorCB)
					}
				}

				function populateDB(tx) {
					tx.executeSql('DROP TABLE IF EXISTS Questions\
			');		
					tx.executeSql('DROP TABLE IF EXISTS Scores\
			');
					tx.executeSql('CREATE TABLE IF NOT EXISTS Questions(id INTEGER PRIMARY KEY AUTOINCREMENT,\
			question TEXT NOT NULL,answer TEXT NOT NULL,player TEXT NOT NULL)\
			');		
					tx.executeSql('CREATE TABLE IF NOT EXISTS Scores(id INTEGER PRIMARY KEY AUTOINCREMENT,\
			player1 INTEGER,player2 INTEGER, player1_name TEXT, player2_name TEXT)\
			');
					tx.executeSql('SELECT * FROM Questions', [], querySuccess, errorCB)
				}

				function successCB() {
					db.transaction(queryDB, errorCB)
				}

				function queryDB(tx) {
					tx.executeSql('SELECT * FROM Questions', [], querySuccess, errorCB)
				}
				
				function querySuccess(tx, results) {
					$.mobile.showPageLoadingMsg(true);
					var len = results.rows.length;
					$("#questionList").html('');
					$("#questionList_player2").html('');
					for (var i = 0; i < len; i++) {
						var row = results.rows.item(i);
						if (row["player"]=='player1') {
							var htmlData = '<li id="' + row["id"] + '"><a href="#">' + row["question"] + '</a></li>';
							$("#questionList").append(htmlData).listview('refresh')
						} else {
							var htmlData = '<li id="' + row["id"] + '"><a href="#">' + row["question"] + '</a></li>';
							$("#questionList_player2").append(htmlData).listview('refresh')
						}
					}
					$.mobile.hidePageLoadingMsg()
				}
				
				function errorCB(err) {}
				$("#question-page .error").html('').hide();
				$(".addNew").bind("click", function(event) {
					$("#question-page .error").html('').hide();
				});

				$("#save").bind("click", function(event) {
					var question = $.trim($("#question").val());
					var answer = $.trim($("#answer").val()).replace(/[^A-Za-z0-9 ]/g, '');
					var player = $.trim($("#player").val());
							var num;
							db.transaction(function(tx) {
								tx.executeSql("SELECT question FROM Questions;", [], function(tx, results) {
									num = results.rows.length;
									if (num > 2) {
										resetForm();
										var y = confirm("You have already created 3 Questions. Its Player 2's turn. Do you want to proceed?");
										if (y == true) {
											db.transaction(function(tx) {
												tx.executeSql("SELECT * FROM Scores", [], function(tx, results) {
												var score = results.rows.item(0);
												$.mobile.changePage($("#question-page2"), {
												});
												$("#ingame_player2_name").html(score['player2_name']);
												resetForm();
												$.mobile.hidePageLoadingMsg()
												})
											})
										} else {
											$.mobile.changePage($("#question-page"), {
											})
										}
									} else {
										if (question == '') {
											$("#question-page .error").html("Please enter the Question").show()
										} else if (answer == '') {
											$("#question-page .error").html("Please enter the Answer").show()
										} else {
											resetForm();
											var id = $("#id").val();
											$("#id").val('');
											if (id == '') {
												var len;
												db.transaction(function(tx) {
													tx.executeSql("SELECT question FROM Questions WHERE question=?;", [question], function(tx, results) {
														len = results.rows.length;
														console.log('Clog: ' + len);
														if (len >= 1) {
															$("#question-page .error").html('Question already exists.').show()
														} else {
															db.transaction(function(tx) {
																tx.executeSql("INSERT INTO Questions (question, answer, player) VALUES  (?, ?, ?)", [question, answer, player], queryDB, errorCB)
																console.log('Clog: ' + question + ' ' + answer + ' ' + player);
															});
															app.addEvent();
															db.transaction(queryDB, errorCB)
														}
													})
												})
											} else {
												console.log('Clog: ' + "start update");
												db.transaction(function(tx) {
													tx.executeSql("UPDATE Questions SET question=?, answer=?, player=? WHERE id=? ", [question, answer, player, id], queryDB, errorCB)
												});
												console.log('Clog: ' + question + ' ' + answer);
												db.transaction(queryDB, errorCB)
											}
										}
									}
								})
							})
				});

				$("#save_player2").bind("click", function(event) {
					var question = $.trim($("#question_player2").val());
					var answer = $.trim($("#answer_player2").val()).replace(/[^A-Za-z0-9 ]/g, '');
					var player = $.trim($("#player_2").val());
							var num;
							db.transaction(function(tx) {
								tx.executeSql("SELECT question FROM Questions;", [], function(tx, results) {
									num = results.rows.length;
									if (num > 5) {
										resetForm();
										var y = confirm("You have already created 3 Questions. Its time to START the game! Do you want to proceed?");
										if (y == true) {
											db.transaction(function(tx) {
												tx.executeSql("SELECT * FROM Scores", [], function(tx, results) {
												var score = results.rows.item(0);
												$.mobile.changePage($("#start_game"), {
												});
												$("#ingame_player2_name_entry").html(score['player2_name']);
												resetForm();
												$.mobile.hidePageLoadingMsg()
												})
											})
										} else {
											$.mobile.changePage($("#question-page2"), {
											})
										}
									} else {
										if (question == '') {
											$("#question-page2 .error_player2").html("Please enter the Question").show()
										} else if (answer == '') {
											$("#question-page2 .error_player2").html("Please enter the Answer").show()
										} else {
											resetForm();
											var id = $("#id").val();
											$("#id").val('');
											if (id == '') {
												var len;
												db.transaction(function(tx) {
													tx.executeSql("SELECT question FROM Questions WHERE question=?;", [question], function(tx, results) {
														len = results.rows.length;
														console.log('Clog: ' + len);
														if (len >= 1) {
															$("#question-page2 .error_player2").html('Question already exists.').show()
														} else {
															db.transaction(function(tx) {
																tx.executeSql("INSERT INTO Questions (question, answer, player) VALUES  (?, ?, ?)", [question, answer, player], queryDB, errorCB)
																console.log('Clog: ' + question + ' ' + answer + ' ' + player);
															});
															app.addEvent();
															db.transaction(queryDB, errorCB)
														}
													})
												})
											} else {
												console.log('Clog: ' + "start update");
												db.transaction(function(tx) {
													tx.executeSql("UPDATE Questions SET question=?, answer=?, player=? WHERE id=? ", [question, answer, player, id], queryDB, errorCB)
												});
												console.log('Clog: ' + question + ' ' + answer);
												db.transaction(queryDB, errorCB)
											}
										}
									}
								})
							})
				});

				$("#create_player_info").bind("click", function(event) {
					var name_player1 = $.trim($("#player1_name").val());
					var name_player2 = $.trim($("#player2_name").val());
					if (name_player1 == '') {
						$("#player_info .error").html("Please enter player 1's name").show()
					} else if (name_player2 == ''){
						$("#player_info .error").html("Please enter player 2's name").show()
					} else {
						db.transaction(function(tx) {
						tx.executeSql("INSERT INTO Scores (player1, player2, player1_name, player2_name) VALUES  (?, ?, ?, ?)", [0, 0, name_player1, name_player2], queryDB, errorCB)
						})
						db.transaction(queryDB, errorCB)
						db.transaction(function(tx) {
							tx.executeSql("SELECT * FROM Scores", [], function(tx, results) {
							var score = results.rows.item(0);
							$.mobile.changePage($("#question-page"), {
							});
							$("#ingame_player1_name").html(score['player1_name']);
							$('#dataList').trigger('create');
							$('#dataList').listview('refresh');
							$.mobile.hidePageLoadingMsg()
							resetForm();
							})
						})
					}
				});

				$("#proceed4").bind("click", function(event) {
					db.transaction(function(tx) {
						tx.executeSql("SELECT * FROM Questions;", [], function(tx, results) {
									var row = results.rows.item(3);
									$.mobile.showPageLoadingMsg(true);
									$.mobile.changePage($("#player1_ingame_1"), {
									});
									$("#player1_ingame_question1").html(row['question']);
									$('#dataList').trigger('create');
									$('#dataList').listview('refresh');
									$.mobile.hidePageLoadingMsg()
						})
					})
				});

				$("#play_again").bind("click", function(event) {
					db.transaction(populateDB, errorCB, successCB);
					$.mobile.showPageLoadingMsg(true);
					$.mobile.changePage($("#index"), {
					});
					$("#play_again .error").html('').hide();
					$.mobile.hidePageLoadingMsg()
					resetForm();
				});

				$("#proceed1").bind("click", function(event) {
					db.transaction(function(tx) {
						tx.executeSql("SELECT * FROM Questions;", [], function(tx, results) {
									var row = results.rows.item(0);
									$.mobile.showPageLoadingMsg(true);
									$.mobile.changePage($("#player2_ingame_1"), {
									});
									$("#player2_ingame_question1").html(row['question']);
									$('#dataList').trigger('create');
									$('#dataList').listview('refresh');
									$.mobile.hidePageLoadingMsg()
						})
					})
				});

				$("#view_results").bind("click", function(event) {
					db.transaction(function(tx) {
						tx.executeSql("SELECT * FROM Scores", [], function(tx, results) {
						var score = results.rows.item(0);
						$.mobile.showPageLoadingMsg(true);
						$.mobile.changePage($("#final_result"), {
						});

						console.log('Clog: FINAL ' + 'Player2 score = '+ score['player2']);
						console.log('Clog: FINAL ' + 'Player1 score = '+ score['player1']);
						console.log('Clog: FINAL ' + 'Score ID = ' + score['id']);
						var rate = ((score['player1'] + score['player2'])/6)*100;
						var rateOfLove = rate.toFixed(1);

                if (score['player1'] == 0 && score['player2'] == 0) {
                    $("#summary").html("Some people are meant to fall in love with each other but not meant to be together. Accept the cold truth, you both need to talk more. And PLAY more. ;)");
                    $("#Message").val("@" + score['player1_name'] + " and @" + score['player2_name'] + " scored " + rateOfLove + "% of LOVE from playing LoveFeud.\n\nSome people are meant to fall in love with each other but not meant to be together. </3\n\n#LoveFeud");
                } else if ((score['player1'] == 0 && score['player2'] == 1) || (score['player1'] == 1 && score['player2'] == 0)) {
                    $("#summary").html("It's funny how people think about how well they know a person, when they really don't. But there is actually some room for improvement. Try playing more till you ran out of questions. ;)");
                    $("#Message").val("@" + score['player1_name'] + " and @" + score['player2_name'] + " scored " + rateOfLove + "% of LOVE from playing LoveFeud.\n\nIt's funny how people think about how well they know a person, when they really don't. But there is actually some room for improvement! ;)\n\n#LoveFeud");
                } else if ((score['player1'] == 0 && score['player2'] == 2) || (score['player1'] == 2 && score['player2'] == 0)) {
                    $("#summary").html("If someone really cares about you they make an effort, not excuses. Make the relationship stand with equal efforts from both sides. :)");
                    $("#Message").val("@" + score['player1_name'] + " and @" + score['player2_name'] + " scored " + rateOfLove + "% of LOVE from playing LoveFeud.\n\nIf someone really cares about you they make an effort, not excuses. Make the relationship stand with equal efforts from both sides. ;)\n\n#LoveFeud");
                } else if (score['player1'] == 0 && score['player2'] == 3) {
                    $("#summary").html("Sometimes we expect more from others because we are willing to do that much for them. Relationship should not be one sided, wake up and do something about it!");
                    $("#Message").val("@" + score['player1_name'] + " and @" + score['player2_name'] + " scored " + rateOfLove + "% of LOVE from playing LoveFeud.\n\nSometimes we expect more from others because we are willing to do that much for them. Relationship should not be one sided. ;)\n\n#LoveFeud");
                } else if (score['player1'] == 1 && score['player2'] == 1) {
                    $("#summary").html("Long distance relationships are hard, but its even harder to not being able to talk to each other even though you are just blocks away. But, if you both work together love will always find a way. :)");
                    $("#Message").val("@" + score['player1_name'] + " and @" + score['player2_name'] + " scored " + rateOfLove + "% of LOVE from playing LoveFeud.\n\nLong distance relationships are hard, but its even harder to not being able to talk to each other even though you are just blocks away. But, if you both work together love will always find a way. :)\n\n#LoveFeud");
                } else if ((score['player1'] == 1 && score['player2'] == 2) || (score['player1'] == 2 && score['player2'] == 1)) {
                    $("#summary").html("A relationship without trust is like having a phone without no service, you just play games. Try talking sincerely and do something loyal, you will be surprised with how much trust you will gain. :)");
                    $("#Message").val("@" + score['player1_name'] + " and @" + score['player2_name'] + " scored " + rateOfLove + "% of LOVE from playing LoveFeud.\n\nA relationship without trust is like having a phone without service, you just play games. Try talking sincerely and do something loyal, you will be surprised with how much trust you will gain. :)\n\n#LoveFeud");
                } else if ((score['player1'] == 1 && score['player2'] == 3) || (score['player1'] == 3 && score['player2'] == 1)) {
                    $("#summary").html("Don't take people for granted. No matter how much they love you, people get tired eventually. Try to be more sensitive and take good care of people who loves you. :)");
                    $("#Message").val("@" + score['player1_name'] + " and @" + score['player2_name'] + " scored " + rateOfLove + "% of LOVE from playing LoveFeud.\n\nDon't take people for granted. No matter how much they love you, people get tired eventually. Try to be more sensitive and take good care of people who loves you. :)\n\n#LoveFeud");
                } else if (score['player1'] == 2 && score['player2'] == 2) {
                    $("#summary").html("Communication can fuel relationships. Spend more time hanging out and getting to know each other. It's not easy finding the right person, but it's worth it.");
                    $("#Message").val("@" + score['player1_name'] + " and @" + score['player2_name'] + " scored " + rateOfLove + "% of LOVE from playing LoveFeud.\n\nCommunication can fuel relationships. Spend more time hanging out and getting to know each other. It's not easy finding the right person, but it's worth it. Almost there! Spread the Love! ;)\n\n#LoveFeud");
                } else if ((score['player1'] == 2 && score['player2'] == 3) || (score['player1'] == 3 && score['player2'] == 2)) {
                    $("#summary").html("It feels good when someone actually listens on what you say. A good conversation keeps a healthy relationship. Not the perfect couple but just right for each other!");
                    $("#Message").val("@" + score['player1_name'] + " and @" + score['player2_name'] + " scored " + rateOfLove + "% of LOVE from playing LoveFeud.\n\nIt feels good when someone actually listens on what you say. A good conversation keeps a healthy relationship. Not the perfect couple but just right for each other! Spread the Love! <3\n\n#LoveFeud");
                } else if (score['player1'] == 3 && score['player2'] == 0) {
                    $("#summary").html("Relationships are worth fighting for, but you can't be the only one fighting. Relationship should not be one sided, wake up and do something about it!");
                    $("#Message").val("@" + score['player1_name'] + " and @" + score['player2_name'] + " scored " + rateOfLove + "% of LOVE from playing LoveFeud.\n\nRelationships are worth fighting for, but you can't be the only one fighting.. ;)\n\n#LoveFeud");
                } else if (score['player1'] == 3 && score['player2'] == 3) {
                    $("#summary").html("True love is hard to find, but even harder to hide! You both nailed it! You guys are the definition of TRUE LOVE! <3 <3 <3");
                    $("#Message").val("@" + score['player1_name'] + " and @" + score['player2_name'] + " scored " + rateOfLove + "% of LOVE from playing LoveFeud.\n\nTrue love is hard to find, but even harder to hide! @" + score['player1_name'] + " and @" + score['player2_name'] + " both nailed it! These guys are the definition of TRUE LOVE! <3 <3 <3\n\n#LoveFeud");
                }

						$("#player1_score").html(score['player1']);
						$("#player2_score").html(score['player2']);
						$("#rate").html(rateOfLove);
						$("#ingame_player1_name_final").html(score['player1_name']);
						$("#ingame_player2_name_final").html(score['player2_name']);
						$('#dataList').trigger('create');
						$('#dataList').listview('refresh');
						$.mobile.hidePageLoadingMsg()
						resetForm();
						})
					})
				});

				$("#proceed2").bind("click", function(event) {
					$("#player2_ingame_question1 #player2_answer1").val('');
					var ingame_answer = $.trim($("#player2_answer1").val()).replace(/[^A-Za-z0-9 ]/g, '');
					console.log('Clog: ' + 'Your answer = '+ ingame_answer);
					db.transaction(function(tx) {
						tx.executeSql("SELECT * FROM Questions;", [], function(tx, results) {
									var before = results.rows.item(0);
									var row = results.rows.item(1);
									$.mobile.showPageLoadingMsg(true);
									$.mobile.changePage($("#player2_ingame_2"), {
									});

									console.log('Clog: ' + 'Player1 answer = '+ before['answer']);

													if (ingame_answer==before['answer']) {
														db.transaction(function(tx) {
															tx.executeSql("SELECT * FROM Scores", [], function(tx, results) {
															var score = results.rows.item(0);
															var p1score = score['player1'];
															var p2score = score['player2']+1;
															var p1name = score['player1_name'];
															var p2name = score['player2_name'];
															var scoreID = score['id'];
															db.transaction(function(tx) {
																tx.executeSql("UPDATE Scores SET player1=?, player2=?, player1_name=?, player2_name=? WHERE id=? ", [p1score, p2score, p1name, p2name, scoreID], queryDB, errorCB)
																	console.log('Clog: ' + 'UPDATED Correct');
															});
															console.log('Clog: ' + 'Player2 score = '+ p2score);
															console.log('Clog: ' + 'Player1 score = '+ p1score);
															console.log('Clog: ' + 'Score ID = ' + scoreID);
															})
														})
														db.transaction(queryDB, errorCB)
													}
							resetForm();
							$("#player2_ingame_question2").html(row['question']);
							$('#dataList').trigger('create');
							$('#dataList').listview('refresh');
							$.mobile.hidePageLoadingMsg()
						})
					})
				});

				$("#proceed3").bind("click", function(event) {
					$("#player2_ingame_question2 #player2_answer2").val('');
					var ingame_answer = $.trim($("#player2_answer2").val()).replace(/[^A-Za-z0-9 ]/g, '');
					console.log('Clog: ' + 'Your answer = '+ ingame_answer);
					db.transaction(function(tx) {
						tx.executeSql("SELECT * FROM Questions;", [], function(tx, results) {
									var before = results.rows.item(1);
									var row = results.rows.item(2);
									$.mobile.showPageLoadingMsg(true);
									$.mobile.changePage($("#player2_ingame_3"), {
									});

									console.log('Clog: ' + 'Player1 answer = '+ before['answer']);

													if (ingame_answer==before['answer']) {
														db.transaction(function(tx) {
															tx.executeSql("SELECT * FROM Scores", [], function(tx, results) {
															var score = results.rows.item(0);
															var p1score = score['player1'];
															var p2score = score['player2']+1;
															var p1name = score['player1_name'];
															var p2name = score['player2_name'];
															var scoreID = score['id'];
															db.transaction(function(tx) {
																tx.executeSql("UPDATE Scores SET player1=?, player2=?, player1_name=?, player2_name=? WHERE id=? ", [p1score, p2score, p1name, p2name, scoreID], queryDB, errorCB)
																	console.log('Clog: ' + 'UPDATED Correct');
															});
															console.log('Clog: ' + 'Player2 score = '+ p2score);
															console.log('Clog: ' + 'Player1 score = '+ p1score);
															console.log('Clog: ' + 'Score ID = ' + scoreID);
															})
														})
														db.transaction(queryDB, errorCB)
													}
							resetForm();
							$("#player2_ingame_question3").html(row['question']);
							$('#dataList').trigger('create');
							$('#dataList').listview('refresh');
							$.mobile.hidePageLoadingMsg()
						})
					})
				});

				$("#proceed3_1").bind("click", function(event) {
					$("#player2_ingame_question3 #player2_answer3").val('');
					var ingame_answer = $.trim($("#player2_answer3").val()).replace(/[^A-Za-z0-9 ]/g, '');
					console.log('Clog: ' + 'Your answer = '+ ingame_answer);
					db.transaction(function(tx) {
						tx.executeSql("SELECT * FROM Questions;", [], function(tx, results) {
									var before = results.rows.item(2);
									$.mobile.showPageLoadingMsg(true);

									console.log('Clog: ' + 'Player1 answer = '+ before['answer']);
											len = results.rows.length;
											console.log('Clog: ' + 'Does player1 score exists: ' + len);
													if (ingame_answer==before['answer']) {
														db.transaction(function(tx) {
															tx.executeSql("SELECT * FROM Scores", [], function(tx, results) {
															var score = results.rows.item(0);
															var p1score = score['player1'];
															var p2score = score['player2']+1;
															var p1name = score['player1_name'];
															var p2name = score['player2_name'];
															var scoreID = score['id'];
															db.transaction(function(tx) {
																tx.executeSql("UPDATE Scores SET player1=?, player2=?, player1_name=?, player2_name=? WHERE id=? ", [p1score, p2score, p1name, p2name, scoreID], queryDB, errorCB)
																	console.log('Clog: ' + 'UPDATED Correct');
															});
															console.log('Clog: ' + 'Player2 score = '+ p2score);
															console.log('Clog: ' + 'Player1 score = '+ p1score);
															console.log('Clog: ' + 'Score ID = ' + scoreID);
															})
														})
														db.transaction(queryDB, errorCB)
													}
							resetForm();
							$.mobile.hidePageLoadingMsg()
							db.transaction(function(tx) {
								tx.executeSql("SELECT * FROM Scores", [], function(tx, results) {
								var score = results.rows.item(0);
								$.mobile.changePage($("#player1_entry"), {
								});
								$("#ingame_player1_name_entry").html(score['player1_name']);
								$('#dataList').trigger('create');
								$('#dataList').listview('refresh');
								$.mobile.hidePageLoadingMsg()
								})
							})
						})
					})
				});

				$("#proceed5").bind("click", function(event) {
					$("#player1_ingame_question1 #player1_answer1").val('');
					var ingame_answer = $.trim($("#player1_answer1").val()).replace(/[^A-Za-z0-9 ]/g, '');
					console.log('Clog: ' + 'Your answer = '+ ingame_answer);
					db.transaction(function(tx) {
						tx.executeSql("SELECT * FROM Questions;", [], function(tx, results) {
									var before = results.rows.item(3);
									var row = results.rows.item(4);
									$.mobile.showPageLoadingMsg(true);
									$.mobile.changePage($("#player1_ingame_2"), {
									});

									console.log('Clog: ' + 'Player2 answer = '+ before['answer']);
													if (ingame_answer==before['answer']) {
														db.transaction(function(tx) {
															tx.executeSql("SELECT * FROM Scores", [], function(tx, results) {
															var score = results.rows.item(0);
															var p1score = score['player1']+1;
															var p2score = score['player2'];
															var p1name = score['player1_name'];
															var p2name = score['player2_name'];
															var scoreID = score['id'];
															db.transaction(function(tx) {
																tx.executeSql("UPDATE Scores SET player1=?, player2=?, player1_name=?, player2_name=? WHERE id=? ", [p1score, p2score, p1name, p2name, scoreID], queryDB, errorCB)
																	console.log('Clog: ' + 'UPDATED Correct');
															});
															db.transaction(queryDB, errorCB)
															console.log('Clog: ' + 'Player2 score = '+ p2score);
															console.log('Clog: ' + 'Player1 score = '+ p1score);
															console.log('Clog: ' + 'Score ID = ' + scoreID);
															})
														})
														db.transaction(queryDB, errorCB)
													}
							resetForm();
							$("#player1_ingame_question2").html(row['question']);
							$('#dataList').trigger('create');
							$('#dataList').listview('refresh');
							$.mobile.hidePageLoadingMsg()
						})
					})
				});	

				$("#proceed6").bind("click", function(event) {
					$("#player1_ingame_question2 #player1_answer2").val('');
					var ingame_answer = $.trim($("#player1_answer2").val()).replace(/[^A-Za-z0-9 ]/g, '');
					console.log('Clog: ' + 'Your answer = '+ ingame_answer);
					db.transaction(function(tx) {
						tx.executeSql("SELECT * FROM Questions;", [], function(tx, results) {
									var before = results.rows.item(4);
									var row = results.rows.item(5);
									$.mobile.showPageLoadingMsg(true);
									$.mobile.changePage($("#player1_ingame_3"), {
									});

									console.log('Clog: ' + 'Player2 answer = '+ before['answer']);
													if (ingame_answer==before['answer']) {
														db.transaction(function(tx) {
															tx.executeSql("SELECT * FROM Scores", [], function(tx, results) {
															var score = results.rows.item(0);
															var p1score = score['player1']+1;
															var p2score = score['player2'];
															var p1name = score['player1_name'];
															var p2name = score['player2_name'];
															var scoreID = score['id'];
															db.transaction(function(tx) {
																tx.executeSql("UPDATE Scores SET player1=?, player2=?, player1_name=?, player2_name=? WHERE id=? ", [p1score, p2score, p1name, p2name, scoreID], queryDB, errorCB)
																	console.log('Clog: ' + 'UPDATED Correct');
															});
															db.transaction(queryDB, errorCB)
															console.log('Clog: ' + 'Player2 score = '+ p2score);
															console.log('Clog: ' + 'Player1 score = '+ p1score);
															console.log('Clog: ' + 'Score ID = ' + scoreID);
															})
														})
														db.transaction(queryDB, errorCB)
													}
							resetForm();
							$("#player1_ingame_question3").html(row['question']);
							$('#dataList').trigger('create');
							$('#dataList').listview('refresh');
							$.mobile.hidePageLoadingMsg()
						})
					})
				});	


				$("#proceed6_1").bind("click", function(event) {
					$("#player1_ingame_question3 #player1_answer3").val('');
					var ingame_answer = $.trim($("#player1_answer3").val()).replace(/[^A-Za-z0-9 ]/g, '');
					console.log('Clog: ' + 'Your answer = '+ ingame_answer);
					db.transaction(function(tx) {
						tx.executeSql("SELECT * FROM Questions;", [], function(tx, results) {
									var before = results.rows.item(5);
									$.mobile.showPageLoadingMsg(true);
									$.mobile.changePage($("#view_result"), {
									});
									console.log('Clog: ' + 'Player2 answer = '+ before['answer']);
													if (ingame_answer==before['answer']) {
														db.transaction(function(tx) {
															tx.executeSql("SELECT * FROM Scores", [], function(tx, results) {
															var score = results.rows.item(0);
															var p1score = score['player1']+1;
															var p2score = score['player2'];
															var p1name = score['player1_name'];
															var p2name = score['player2_name'];
															var scoreID = score['id'];
															db.transaction(function(tx) {
																tx.executeSql("UPDATE Scores SET player1=?, player2=?, player1_name=?, player2_name=? WHERE id=? ", [p1score, p2score, p1name, p2name, scoreID], queryDB, errorCB)
																	console.log('Clog: ' + 'UPDATED Correct');
															});
															db.transaction(queryDB, errorCB)
															console.log('Clog: ' + 'Player2 score = '+ p2score);
															console.log('Clog: ' + 'Player1 score = '+ p1score);
															console.log('Clog: ' + 'Score ID = ' + scoreID);
															})
														})
														db.transaction(queryDB, errorCB)
													}
							resetForm();
							$.mobile.hidePageLoadingMsg()
						})
					})
				});	


				$(".refresh").bind("click", function(event) {
					db.transaction(queryDB, errorCB)
				});

				$(".back").bind("click", function(event) {
					resetForm();
					db.transaction(queryDB, errorCB)
				});
				
				function resetForm() {
					$("#player_info .error").html('').hide();

					$("#question-page .error").html('').hide();
					$("#question-page #question").val('');
					$("#question-page #answer").val('');

					$("#question-page2 .error_player2").html('').hide();
					$("#question-page2 #question_player2").val('');
					$("#question-page2 #answer_player2").val('');

					$("#player2_ingame_1 #player2_answer1").val('');
					$("#player2_ingame_2 #player2_answer2").val('');
					$("#player2_ingame_3 #player2_answer3").val('');

					$("#player1_ingame_1 #player1_answer1").val('');
					$("#player1_ingame_2 #player1_answer2").val('');
					$("#player1_ingame_3 #player1_answer3").val('');
				}
				
				$("#question-page [data-role='content'] ol").on('tap taphold', 'li', function(event) {
					event.preventDefault();
					event.stopImmediatePropagation();
					var liId = this.id;
					if (event.type === 'taphold') {
						var $popup = $('#actionList-popup');
						$("#actionList").html('');
						$("#actionList").append('<li id="edit&' + liId + '">Edit</li>').listview('refresh');
						$("#actionList").append('<li id="delete&' + liId + '">Delete</li>').listview('refresh');
						$popup.popup();
						$popup.popup('open');
						$("#tapHoldCheck").val('true')
					} else if (event.type === 'tap') {
						if ($("#tapHoldCheck").val() == '') {
							db.transaction(function(tx) {
								tx.executeSql("SELECT question, answer, player FROM Questions WHERE id=?;", [liId], function(tx, results) {
									var row = results.rows.item(0);
									$.mobile.showPageLoadingMsg(true);
									$.mobile.changePage($("#displayDataPage"), {
									});
									$("#feudQuestion").html(row['question']);
									$("#feudAnswer").html(row['answer']);
									$("#feudPlayer").html(row['player']);
									$('#dataList').trigger('create');
									$('#dataList').listview('refresh');
									$.mobile.hidePageLoadingMsg()
								})
							})
						}
					}
				});

				$('#actionList-popup').bind({
					popupafterclose: function(event, ui) {
						$("#tapHoldCheck").val('')
					}
				});


				$("#question-page2 [data-role='content'] ol").on('tap taphold', 'li', function(event) {
					event.preventDefault();
					event.stopImmediatePropagation();
					var liId = this.id;
					if (event.type === 'taphold') {
						var $popup = $('#actionList_player2-popup');
						$("#actionList_player2").html('');
						$("#actionList_player2").append('<li id="edit&' + liId + '">Edit</li>').listview('refresh');
						$("#actionList_player2").append('<li id="delete&' + liId + '">Delete</li>').listview('refresh');
						$popup.popup();
						$popup.popup('open');
						$("#tapHoldCheck").val('true')
					} else if (event.type === 'tap') {
						if ($("#tapHoldCheck").val() == '') {
							db.transaction(function(tx) {
								tx.executeSql("SELECT question, answer, player FROM Questions WHERE id=?;", [liId], function(tx, results) {
									var row = results.rows.item(0);
									$.mobile.showPageLoadingMsg(true);
									$.mobile.changePage($("#displayDataPage_player2"), {
									});
									$("#feudQuestion_player2").html(row['question']);
									$("#feudAnswer_player2").html(row['answer']);
									$("#feudPlayer_player2").html(row['player']);
									$('#dataList').trigger('create');
									$('#dataList').listview('refresh');
									$.mobile.hidePageLoadingMsg()
								})
							})
						}
					}
				});

				$('#actionList_player2-popup').bind({
					popupafterclose: function(event, ui) {
						$("#tapHoldCheck").val('')
					}
				});

				$("#question-page [data-role='popup'] ol").on('click', 'li', function(event) {
					var action_liId = this.id.split('&');
					var action = action_liId[0];
					var id = action_liId[1];
					if (action == 'edit') {
						db.transaction(function(tx) {
							tx.executeSql("SELECT question, answer, player FROM Questions WHERE id=?;", [id], function(tx, results) {
								var row = results.rows.item(0);
								$("#question").val(row['question']);
								$("#answer").val(row['answer']);
								$("#player").val(row['player']);
								$("#id").val(id);
								$.mobile.changePage($("#question-page"), {
								})
							})
						})
					}
					if (action == 'delete') {
						var y = confirm("Are you sure?");
						if (y == true) {
							db.transaction(function(tx) {
								tx.executeSql("DELETE FROM Questions WHERE id=?", [id], queryDB, errorCB)
							})
							$.mobile.changePage($("#question-page"), {
						})
						} else {
							$.mobile.changePage($("#question-page"), {
							})
						}
					}
				});

				$("#question-page2 [data-role='popup'] ol").on('click', 'li', function(event) {
					var action_liId = this.id.split('&');
					var action = action_liId[0];
					var id = action_liId[1];
					if (action == 'edit') {
						db.transaction(function(tx) {
							tx.executeSql("SELECT question, answer, player FROM Questions WHERE id=?;", [id], function(tx, results) {
								var row = results.rows.item(0);
								$("#question_player2").val(row['question']);
								$("#answer_player2").val(row['answer']);
								$("#player_2").val(row['player']);
								$("#id").val(id);
								$.mobile.changePage($("#question-page2"), {
								})
							})
						})
					}
					if (action == 'delete') {
						var y = confirm("Are you sure?");
						if (y == true) {
							db.transaction(function(tx) {
								tx.executeSql("DELETE FROM Questions WHERE id=?", [id], queryDB, errorCB)
							})
							$.mobile.changePage($("#question-page2"), {
						})
						} else {
							$.mobile.changePage($("#question-page2"), {
							})
						}
					}
				});

				function onConfirm(buttonIndex, id) {
					if (buttonIndex === 1) {
						db.transaction(function(tx) {
							tx.executeSql("DELETE FROM Questions WHERE id=?", [id], queryDB, errorCB)
						})
						$.mobile.changePage($("#question-page"), {
						})
					}
					if (buttonIndex === 2) {
						$.mobile.changePage($("#question-page"), {
						})
					}
				}
			});
