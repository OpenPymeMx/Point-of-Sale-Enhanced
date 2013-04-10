SRC_DIR=.

all: clean sloc flakes lint csslint jshint xmllint clone

sloc:
	sloccount --duplicates --wide --details $(SRC_DIR) | fgrep -v .git > sloccount.sc || :

test:
	cd $(SRC_DIR) && nosetests --verbose --with-xunit --xunit-file=../xunit.xml --with-xcoverage --xcoverage-file=../coverage.xml || :

flakes:
	find $(SRC_DIR) -name *.py|egrep -v '^./tests/'|xargs pyflakes  > pyflakes.log || :

lint:
	find $(SRC_DIR) -name *.py|egrep -v '^./tests/' | xargs pylint --output-format=parseable --reports=y > pylint.log || :
	pep8 --ignore=E501 --repeat --show-source $(SRC_DIR) > pep8.log || :

csslint:
	csslint --format=checkstyle-xml $(SRC_DIR) > csslint-result.xml || :

jshint:
	jshint --verbose --reporter=checkstyle $(SRC_DIR) > jslint-result.xml || :

xmllint:
	find -L . -regex ".*\.[cz]?xml|zcml" | xargs -r xmllint --noout 2>> xmllint.log >> xmllint-errors.log || :

clone:
	clonedigger --cpd-output $(SRC_DIR) || :

clean:
	rm -f pyflakes.log
	rm -f pylint.log
	rm -f sloccount.sc
	rm -f output.xml
	rm -f coverage.xml
	rm -f xunit.xml
