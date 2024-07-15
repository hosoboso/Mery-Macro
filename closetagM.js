// #title = "Close Last Tag"
// #tooltip = "�I���^�O����"
// #icon = "xx.ico"
// ��͍D�݂œK�X�ύX���Ă��������B

// Close Last Tag 3.0 Mery�p ���Ɖ�����
// �����gis_dur���ɂ��Close Last Tag 3.0��
// �l�p�ɏ������������̂ł��B
// �e�L�X�g�G�f�B�^Mery�ňꉞ�����܂��B����ۏ؂͂ł��܂���B
// JavaScript�̕׋����łȂ̂Ń~�X�����肻���ȋC�����܂��B
// JavaScript�̕׋����łȂ̂ŃR�����g����������ǉ����Ă��܂��B

// ���t�@�C����SJIS�ł���UTF-8�ŕۑ����Ă������܂�

// �ȉ��I���W�i���̃��C�Z���X

/**********************************************************
**  Close Last Tag 3.0                                   **
***********************************************************
**  A "Sakura-Editor Macro" using WSH 5.6                **
**  For sakura.exe ver.1.6.2.0 and over                  **
**                               zlib/libpng ���C�Z���X  **
**                      Copyright (C) 2004-2012 gis_dur  **
***********************************************************
**�y����z                                               **
**  �J�[�\���ʒu���O�ɂ��� HTML/XML �^�O��             **
**  �t�@�C���擪�Ɍ������Č������A                       **
**  1. �I���^�O�̂Ȃ��J�n�^�O                            **
**  2. ���Ă��Ȃ�HTML�R�����g        <!--      -->     **
**  3. ���Ă��Ȃ�CDATA�u���b�N       <![CDATA[ ]]>     **
**  4. ���Ă��Ȃ�JSP�X�N���v�g���b�g <%        %>      **
**  5. ���Ă��Ȃ�JSP�R�����g         <%--      --%>    **
**  ������ꍇ�A�Ή�����I���^�O��}�����܂��B           **
**  �R�����g�^�O���͖������܂��B                         **
**********************************************************/

// �T�N���G�f�B�^ unicode �ł̏ꍇ�� true �ɂ���
// var UNICODE_VER = true;
// xml ���[�h�i�啶���E����������ʂ���j
var XML_MODE = false;
// �}���������^�O�̌��ɃJ�[�\�����ړ����邩�ǂ���
// var MOVE_CURSOR = true;
// ���^�O���ȗ��\�ȗv�f��
var NO_CLOSE_TAG = "," +
[
	"area", "base", "br",
	"col", "embed", "frame", "hr", "img",
	"input", "link", "meta", "wbr",
	"source", "track"
	// "source", "track"��HTML5�Œǉ�
	// "basefont", "spacer", "isindex" ,"nextid"��HTML5�Ŕp�~�Ȃ̂ŏ�ꗗ����폜���܂���
	// "bgsound"��Internet Explorer �Ǝ��^�O�Ȃ̂ō폜���܂���
	// "frame", "keygen", "param"�͔񐄏��Ȃ̂ō폜���܂���
	// �Q�ƁFVoid element �i��v�f�j https://developer.mozilla.org/ja/docs/Glossary/Void_element
].join(",") + ",";

/*********************************************************/

// �V�F��
// �G���[�_�C�A���O�\���p�AWindow.alert()���g���ꍇ�͕s�v
// if (typeof(Shell) == "undefined") {
//   Shell = new ActiveXObject("WScript.Shell");
// }

// ������g��
// ���T�N���G�f�B�^��ANSI�ŗp
// if (typeof(String.prototype.is_wide) == "undefined") {
//   String.prototype.is_wide = function() {
//     if (UNICODE_VER) return false;
//     if (this.length == 0) return false;
//     var c = (this.length == 1) ? this : this.charAt(0);
//     return (!c.match(/[�A-���@�B�D�F�H�b�������J�K�[�A�B�u�v�E]/) && escape(c).length >= 4);
//   };
// }

(function() {
	if (!XML_MODE) {
		NO_CLOSE_TAG = NO_CLOSE_TAG.toUpperCase();
	}
	// �^�O��\�����K�\��
	var TAG_CHARS = "s!\"#$%&\'()=~|^\\`{+*}<>?@[;],/";
	(function(){
		var tmp = "";
		for (var i=0; i<TAG_CHARS.length; i++) {
			tmp += "\\"+TAG_CHARS.charAt(i);
		}
		TAG_CHARS = "[^"+tmp+"]+";
	})();
	var TAGS_EXPRESSION = new RegExp();
	TAGS_EXPRESSION.compile("<!--|-->|<!\\[CDATA\\[|\\]\\]>|<%--|--%>|<%|%>|<"+TAG_CHARS+"([^>]*/>)?|<\\/"+TAG_CHARS+"", "g");
 
	// �f�[�^
	var stack = new Array();
	var ins_text = "";
	var err_text = "";
 
	// �X�e�[�g
	var is_comment = false;
	var is_cdata = false;
	var is_jsp_comment = false;
	var is_jsp = false;
	var is_error = false;

// �e�L�X�g�����ׂĎ擾
//  Editor.CancelMode(0);
//  var cursorX = Number(Editor.ExpandParameter('$x')) - 1;
//  var cursorY = Number(Editor.ExpandParameter('$y')) - 1;
//  Editor.SelectAll(0);
//  var all_text = Editor.GetSelectedString(0);
//  Editor.CancelMode(0);
// 
//  ���s�𓝈�
//  ��Mery �̃G�f�B�^�G���W���͓����f�[�^�̉��s�R�[�h�����ׂ� LF �ň����d�l�Ȃ̂ŉ��s�𓝈ꂷ��K�v�͂Ȃ�
//  all_text = all_text.replace(/\r\n|\r|\n/g, "\n");
//  var all_lines = all_text.split("\n");
//  var num_lines = all_lines.length;
// 
//  �J�[�\���ȑO�̃e�L�X�g�����ׂĎ擾
//  var tmp_text = all_lines[cursorY];
//  if (tmp_text == null) {
//    tmp_text = "";
//  }
//  if (num_lines-(cursorY+1) > 0) {
//    all_lines.splice(cursorY+1, num_lines-(cursorY+1));
//  }
//  for (var i=0; i<cursorX; i++) {
//    if (tmp_text.charAt(i).is_wide()) {
//      cursorX--;
//    }
//  }
//  all_lines[cursorY] = tmp_text.substring(0, cursorX);

	// ���݂̃X�N���[���o�[�擾
	var sx = ScrollX, sy = ScrollY;

	// ���݂̃J�[�\���ʒu���擾�@cursorX�̓J�[�\�����@cursorY�̓J�[�\���s
	var cursorX = document.selection.GetActivePointX(mePosLogical);
	var cursorY = document.selection.GetActivePointY(mePosLogical);
	// ���ׂẴe�L�X�g��I�����A�I���e�L�X�g��all_text�Ƃ���
	document.selection.selectAll();
	var all_text = document.selection.Text;
	// �I�������@meCollapseStart�őI���J�n�ʒu�Ɍ������đI��͈͂�����
	document.selection.Collapse(meCollapseStart);
	
	// �S�e�L�X�g�����s�ŕ�������Array��all_lines
	var all_lines = all_text.split("\n");
	// �S�e�L�X�g�̍s��num_lines
	var num_lines = all_lines.length;

	// �J�[�\���s�̃J�[�\�����O�̃e�L�X�gtmp_text_start
	var tmp_text_start = document.GetLine(cursorY).substring(0, (cursorX - 1));
	
	// �J�[�\���s�̃J�[�\�����s������tmp_text_start��null�Ȃ̂ŁA�J���ɒ���
	if (tmp_text_start == null) {
		tmp_text_start = "";
	}
	
	// �J�[�\���ȑO�̃e�L�X�g���s���Ƃ�Array��
	var cursorBeforeArray = [];
	for (var i=0; i<(cursorY-1); i++) {
		cursorBeforeArray[i] = all_lines[i];
	}
	//�Ō��tmp_text_start�𑫂�
	cursorBeforeArray[cursorY-1] = tmp_text_start;

// �^�O���擾
// var all_tags = all_lines.join(" ").match(TAGS_EXPRESSION);
// var num_tags = (all_tags == null)? 0: all_tags.length;

	// cursorBeforeArray�̒��̃^�O���擾
	var all_tags = cursorBeforeArray.join(" ").match(TAGS_EXPRESSION);
	var num_tags = (all_tags == null)? 0: all_tags.length;
 
	// ���O�̊J�n�^�O�������@now_text���^�O
	for (var i=num_tags-1; i>=0; i--) {
		// �^�O������擾
		var now_text = all_tags[i];
		if (!XML_MODE) {
			now_text = now_text.toUpperCase();
		}
 
		// ����ȃX�e�[�g�ɂ���ꍇ
		if (is_comment) {
			if (now_text == "<!--") {
				is_comment = false;
			}
			continue;
		}
		else if (is_cdata) {
			if (now_text == "<![CDATA[") {
				is_cdata = false;
			}
			continue;
		}
		else if (is_jsp_comment) {
			if (now_text == "<%--") {
				is_jsp_comment = false;
			}
			continue;
		}
		else if (is_jsp) {
			if (now_text == "<%") {
				is_jsp = false;
			}
			continue;
		}
 
		// ����ȃX�e�[�g�ɑJ�ڂ���ꍇ
		if (now_text == "-->") {
			is_comment = true;
			continue;
		}
		else if (now_text == "<!--") {
			ins_text = "-->";
			break;
		}
		else if (now_text == "]]>") {
			is_cdata = true;
			continue;
		}
		else if (now_text == "<![CDATA[") {
			ins_text = "]]>";
			break;
		}
		else if (now_text == "--%>") {
			is_jsp_comment = true;
			continue;
		}
		else if (now_text == "<%--") {
			ins_text = "--%>";
			break;
		}
		else if (now_text == "%>") {
			is_jsp = true;
			continue;
		}
		else if (now_text == "<%") {
			ins_text = "%>";
			break;
		}
		// ���^�O�s�v
		else if (now_text.indexOf("/>") != -1) {
			continue;
		}
		// ���^�O�̃X�^�b�N�ɒǉ�
		else if (now_text.indexOf("</") == 0) {
			now_text = now_text.substring(2);
			stack.push(now_text);
			continue;
		}
 
		// �v�f���擾
		now_text = now_text.substring(1);
 
		// �ȗ��\�ȃ^�O�̏ꍇ
		if (NO_CLOSE_TAG.indexOf(","+now_text+",") != -1) {
			if (stack.length == 0) {
				continue;
			}
			else {
				tmp_text = stack.pop();
				if (now_text != tmp_text) {
					stack.push(tmp_text);
				}
				continue;
			}
		}
		// �ʏ�̃^�O�̏ꍇ
		else {
			if (stack.length == 0) {
				ins_text = "</" + all_tags[i].substring(1) + ">";
				break;
			}
			else {
				tmp_text = stack.pop();
				if (now_text != tmp_text) {
					is_error = true;
					err_text += "�^�O�̕�܊֌W���s���ł��B\n";
					err_text += "<"+now_text+"> ... ... </"+tmp_text+">\n";
					stack = new Array();
					break;
				}
			}
		}
	}
 
	// �R�����g��
	if (is_comment) {
		is_error = true;
		err_text += "�R�����g�̊J�֌W���s���ł��B\n";
	}
	// CDATA ��
	else if (is_cdata) {
		is_error = true;
		err_text += "CDATA �u���b�N�̊J�֌W���s���ł��B\n";
	}
	// JSP �R�����g��
	else if (is_jsp_comment) {
		is_error = true;
		err_text += "JSP �R�����g�̊J�֌W���s���ł��B\n";
	}
	// JSP ��
	else if (is_jsp) {
		is_error = true;
		err_text += "JSP �X�N���v�g���b�g�̊J�֌W���s���ł��B\n";
	}
	// �X�^�b�N�ɏI���^�O����
	else if (stack.length > 0) {
		is_error = true;
		err_text += "�J�n�^�O�̂Ȃ��I���^�O��������܂����B\n";
		for (var i=0; i<stack.length; i++) {
			err_text += "<"+stack[i]+">\n";
		}
	}

// �G���[�_�C�A���O�\��
// if (is_error) {
//   Shell.Popup(err_text, 0, "���@�G���[", 0);
//   return;
// }
// 
// �I���^�O�̑}��
// Editor.InsText(ins_text);
// 
// �J�[�\���𓮂����Ȃ��ꍇ�́A���̈ʒu�ɖ߂�
// if (!MOVE_CURSOR) {
//   for (var i=0; i<ins_text.length; i++) {
//     Editor.Left(0);
//   }

	// �G���[�_�C�A���O�\��
	// ���}�N���̓G���[�_�C�A���O�\���ȊO�ɃV�F���g���Ă��Ȃ��̂�(JScript�̓V�F���Ń_�C�A���O�\���j�A
	// �V�F���ł͂Ȃ�Window.alert()���g��
	if (is_error) {
	alert('���@�G���[\n' + err_text);
		return;
	}
 
	// �I���^�O�̑}���@�^�O�}���Ȃ��Ȃ�J�[�\�������̈ʒu�ɖ߂�����
	document.selection.SetActivePoint(mePosLogical, cursorX, cursorY, false);
	if (num_tags != 0){
	document.write(ins_text);
	}
	//�X�N���[���ʒu�𕜌��@���ꂪ�Ȃ��Ƒ}���^�O�s���E�B���h�E��ԉ��ɃX�N���[��������ԂɂȂ�
	ScrollX = sx; ScrollY = sy;
})();